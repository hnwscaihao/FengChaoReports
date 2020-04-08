// <b>GW_ProjectFieldAutomatic Calaculation</b>
// <p>
// MKS ALM 2009 solution
// <p>
//Automatic calculation of the indicators of the project kpi report
// <p>
// This trigger is a Schedual Trigger.
// <p>
// <p>
// Author : Cai Hao.
// Create Date : 2020-2-26
// </p>
//
// @param String passwd


importPackage(Packages.javax.activation);
importPackage(Packages.com.mks.api);
function abort(s){
    eb.abortScript(s, true);
}
function log(s){
	eb.print(s,10);
}
var eb = bsf.lookupBean("siEnvironmentBean");
eb.setMessageCategory("SVOLT");//设置日志分类

// Lookup the parameters bean, and from it find our three parameters, the recipient, the subject, and the message start.
var params = bsf.lookupBean("parametersBean");
var passwd = params.getParameter("passwd");
// Find the server bean, this allows us to lookup an arbitrary issue
var server = bsf.lookupBean("imServerBean");
var delta = bsf.lookupBean("imIssueDeltaBean");
var stb = bsf.lookupBean("imScheduleTriggerArgumentsBean");
var allItemIds = stb.getIssues();// 所有的符合你写的query的数据
var mksHost = eb.getServerConfigurationProperty("mksis.logging.syslog.hostname");
var mksPort = eb.getHostPort();
var splitSperator = "<;>";//各个KPI之间的分隔符
var splitColon = "<:>";//KPI SNO与内容的分隔符
var innerSperator = ";"//KPI内容，不同部分之间的分隔符
var innerAnd = "<and>";//KPI内容，多个条件或多个对象的与连接符
var innerOr = "<or>";//KPI内容，多个条件或多个对象的或连接符
var innerPl = "+";//KPI内容，拆分显示的连接符
var innerComma = ",";//KPI内容，拆分显示的连接符
var innerEq = "=";//KPI内容，连接条件
var innerUneq = "!=";//KPI内容，连接条件
var innerLarger = ">";
var innerLargerEqu = ">=";
var innerSmall = "<";
var innerSmallEqu = "<=";
var innerBegin = "(";//KPI Condition 多条件连接开始
var innerEnd = ")";//KPI Condition 多条件连接结束
var emptyQueryCondition = "and (())";

importPackage(Packages.java.util);
importPackage(Packages.java.lang);

var fieldMap = new HashMap();//记录所有字段的类型，用以判断条件使用的表达式

/** 循环计算每个项目的*/
function main(){
	if(!allItemIds || allItemIds.length == 0){
		return;
	}
	log("...Schedual Send Item Length =" + allItemIds.length);
	for(var i=0; i<allItemIds.length; i++){//循环到所有要的数据
		var kpiItem = server.getIssueDeltaBean(allItemIds[i]);
		var project = kpiItem.getOldProject();//当前所属项目
		var kpiValue = "";//实际值
		try{
			var allFormulaStr = replaceNewline(kpiItem.getOldFieldValue("KPI Formula"));//计算公式字段
			var allCalculationObjectStr = replaceNewline(kpiItem.getOldFieldValue("KPI Calculation Object"));//计算对象字段
			var allCalculationStateStr = replaceNewline(kpiItem.getOldFieldValue("KPI Calculation State"));//计算状态字段
			log("allCalculationStateStr = " + allCalculationStateStr);
			var allCalculationConditionStr = replaceNewline(kpiItem.getOldFieldValue("KPI Calculation Conditions"));//计算条件字段
			log("allCalculationConditionStr = " + allCalculationConditionStr);
			var allCalculationSplitStr = replaceNewline(kpiItem.getOldFieldValue("KPI Calculation Split"));//拆分计算显示字段
			var allCalculationRecordStr = replaceNewline(kpiItem.getOldFieldValue("KPI Record Field"));//KPI计算字段，当前字段有值，不计算直接获取字段记录的值
			var formulaMap = new HashMap();//循环记录所有的formula
			var calculationObjectMap = new HashMap();//记录需要计算的对象，
			var calculationStateMap = new HashMap();//记录需要查询对象的状态(可以是多状态)
			var calculationConditonMap = new HashMap();//记录需要查询对象的条件(可以是多条件)
			var calculationSplitMap = new HashMap();//记录拆分计算显示字段
			var calculationRecordMap = new HashMap();//记录实际记录KPI的字段
			var snoList = new ArrayList();
			//1. 将formula解析，根据formula判定KPI计算方法
			var formulaStrSplits = allFormulaStr?allFormulaStr.split(splitSperator):undefined;
			if(formulaStrSplits && formulaStrSplits.length>0){
				for(var index=0; index<formulaStrSplits.length; index++){
					var singleFormulaStr = formulaStrSplits[index];
					//2. 将单个 KPI的内容 拆分为 SNO 和 formula
					var singleFormulaS = singleFormulaStr.split(splitColon);
					formulaMap.put(singleFormulaS[0],singleFormulaS[1]);
					snoList.add(singleFormulaS[0]);
				}
			}
			//3. 将计算对象解析，根据Object判定KPI计算的对象
			var calculationObjectSplits = allCalculationObjectStr?allCalculationObjectStr.split(splitSperator):undefined;
			if(calculationObjectSplits && calculationObjectSplits.length>0){
				for(var index=0; index<calculationObjectSplits.length; index++){
					var singleObjectStr = calculationObjectSplits[index];
					//4. 将单个 KPI的内容 拆分为 SNO 和 对象
					var singleObjectS = singleObjectStr.split(splitColon);
					calculationObjectMap.put(singleObjectS[0],singleObjectS[1]);
				}
			}
			//5. 将计算状态解析，根据State判定KPI计算的状态
			var calculationStateSplits = allCalculationStateStr?allCalculationStateStr.split(splitSperator):undefined;
			if(calculationStateSplits && calculationStateSplits.length>0){
				for(var index=0; index<calculationStateSplits.length; index++){
					var singleStateStr = calculationStateSplits[index];
					//6. 将单个 KPI的内容 拆分为 SNO 和 状态
					var singleStateS = singleStateStr.split(splitColon);
					calculationStateMap.put(singleStateS[0],singleStateS[1]);
				}
			}
			//7. 将计算条件解析，根据条件判定KPI计算对象的数量
			var calculationConditionSplits = allCalculationConditionStr?allCalculationConditionStr.split(splitSperator):undefined;
			if(calculationConditionSplits && calculationConditionSplits.length>0){
				for(var index=0; index<calculationConditionSplits.length; index++){
					var singleConditionStr = calculationConditionSplits[index];
					//8. 将单个 KPI的内容 拆分为 SNO 和 条件
					var singleConditionS = singleConditionStr.split(splitColon);
					calculationConditonMap.put(singleConditionS[0],singleConditionS[1]);
				}
			}
			//9. 判定分开显示的依据字段，根据条件判定KPI计算依据字段
			var calculationSplitSplits = allCalculationSplitStr?allCalculationSplitStr.split(splitSperator):undefined;
			if(calculationSplitSplits && calculationSplitSplits.length>0){
				for(var index=0; index<calculationSplitSplits.length; index++){
					var singleSplitStr = calculationSplitSplits[index];
					//10. 将单个 KPI的内容 拆分为 SNO 和 依据字段
					var singleSplitS = singleSplitStr.split(splitColon);
					calculationSplitMap.put(singleSplitS[0],singleSplitS[1]);
				}
			}
			//11. 实际保存KPI数据的值
			var calculationRecordSplits = allCalculationRecordStr?allCalculationRecordStr.split(splitSperator):undefined;
			if(calculationRecordSplits && calculationRecordSplits.length>0){
				for(var index=0; index<calculationRecordSplits.length; index++){
					var singleRecordStr = calculationRecordSplits[index];
					//12. 将单个 KPI的内容 拆分为 SNO 和 状态
					var singleRecordS = singleRecordStr.split(splitColon);
					calculationRecordMap.put(singleRecordS[0],singleRecordS[1]);
				}
			}
			
			log("snoList="+snoList);
			log("formulaMap="+formulaMap);
			log("calculationObjectMap="+calculationObjectMap);
			log("calculationStateMap="+calculationStateMap);
			log("calculationConditonMap="+calculationConditonMap);
			log("calculationSplitMap="+calculationSplitMap);
			log("calculationRecordMap="+calculationRecordMap);
			//逐条解析 formula，计算表达式
			for(var index = 0; index<snoList.size(); index ++){
				var SNO = snoList.get(index);
				log("Project = "+ project + "||SNO = "+SNO);
				try{
					var formulaBe = formulaMap.get(SNO);
					var formulaStr = trimStr(formulaBe);//表达式
					log("formulaStr = "+ formulaStr);
					var calculationObject = calculationObjectMap.get(SNO);//计算对象
					log("calculationObject = "+ calculationObject);
					var calculationState = calculationStateMap.get(SNO);//计算对象的状态
					log("calculationState = "+ calculationState);
					var calculationCondition = calculationConditonMap.get(SNO);//计算对象的条件
					log("calculationCondition = "+ calculationCondition + " || length = " + (calculationCondition?calculationCondition.length():0));
					var calculationSplit = calculationSplitMap.get(SNO);//拆分显示字段。。Number统计才能拆分显示，A/B类型不拆分
					log("calculationSplit = "+ calculationSplit);
					var calculationRecordField = calculationRecordMap.get(SNO);//实际记录字段，A/B类型无实际记录字段
					log("calculationRecordField = "+ calculationRecordField);
					var fields = ["Type","State"];
					var splitFields = [];
					if(calculationSplit && calculationSplit != null && calculationSplit != "null"){//如果有拆分字段，需要重新返回
						var curSplitFields = calculationSplit.split(innerAnd);
						log("Start Split :" + curSplitFields.length);
						for(var splitInd=0; splitInd<curSplitFields.length; splitInd++){
							log("Split index = " +splitInd + " = " + curSplitFields[splitInd] );
							var splitFieldVal = curSplitFields[splitInd].trim().split(":");
							fields.push(splitFieldVal[0].trim());
							splitFields.push(curSplitFields[splitInd].trim());
						}
					}
					log("splitFields="+splitFields);
					if("A" == formulaStr ){//统计单数量，有可能有拆分显示
						log("A");
						var resultList = searchKPI(project,calculationObject,calculationState,calculationCondition,fields);
						log("SNO " +SNO+ "  resultList="+resultList.length);
						if(splitFields.length>0){
							var splitKPIVal = getSplitValues(SNO,splitFields,calculationObject,calculationState,resultList,false,undefined);
							kpiValue = kpiValue + splitKPIVal + "<;>";
						}else{
							kpiValue = kpiValue + SNO +"<:>"+ (resultList.length)+"<;>";
						}
						log("A kpiValue = " + kpiValue);
					}else if("A/B*100" == formulaStr ){//两部分拆分计算数量，有可能有拆分显示
						log("A/B*100");
						var outObjectArr = calculationObject.split(innerSperator);//获取两个计算指标的查询对象数组，
						var outStateArr = undefined;//获取两个计算指标的查询状态数组，
						if(calculationState && calculationState!= null && calculationState!=''){
							outStateArr = calculationState.split(innerSperator);
						}
						var outConditionArr = undefined;
						if(calculationCondition && calculationCondition!= null && calculationCondition!=''){
							outConditionArr = calculationCondition.split(innerSperator);//以;拆分查询条件
						}
						var resultA = [];
						var resultB = [];
						for(var outInd=0; outInd<outObjectArr.length; outInd++ ){
							var objectStr = outObjectArr[outInd];//获取查询数组，如果需要查询多个对象，拆分
							log("objectStr="+objectStr);
							var stateStr = outStateArr?outStateArr[outInd]:undefined;//获取查询状态数组，如果需要查询多个状态，拆分
							log("stateStr="+stateStr);
							var conditionStr = outConditionArr?outConditionArr[outInd]:undefined;
							log("conditionStr="+conditionStr);
							
							if(outInd == 0){
								resultA = searchKPI(project,objectStr,stateStr,conditionStr,fields);
								log("SNO " +SNO+ " resultA="+resultA.length);
							}else{
								resultB = searchKPI(project,objectStr,stateStr,conditionStr,fields);
								log("SNO " +SNO+ " resultB="+resultB.length);
							}
						}
						var lengthA = resultA.length;
						var lengthB = resultB.length;
						var SNOVal = keepTwoDecimal(lengthA,lengthB);
						kpiValue = kpiValue + SNO+"<:>"+ SNOVal+"%<;>";
					}else if("(A-B)/A*100" == formulaStr ){//两部分拆分计算数量，有可能有拆分显示
						log("(A-B)/A*100");
						var outObjectArr = calculationObject.split(innerSperator);//获取两个计算指标的查询对象数组，
						var outStateArr = calculationState?calculationState.split(innerSperator):undefined;//获取两个计算指标的查询状态数组，
						var outConditionArr = undefined;
						if(calculationCondition && calculationCondition!= null && calculationCondition!=''){
							log("calculationCondition split :" );
							outConditionArr = calculationCondition.split(innerSperator);//以;拆分查询条件
						}
						log("outConditionArr = " + (outConditionArr?outConditionArr.length:"undefined"));
						var resultA = [];
						var resultB = [];
						for(var outInd=0; outInd<outObjectArr.length; outInd++){
							var objectStr = outObjectArr[outInd];//获取查询数组，如果需要查询多个对象，拆分
							var stateStr = outStateArr && outStateArr[outInd]?outStateArr[outInd]:undefined;//获取查询状态数组，如果需要查询多个状态，拆分
							var conditionStr = outConditionArr?outConditionArr[outInd]:undefined;
							log("conditionStr="+conditionStr);
							if(outInd == 0){
								resultA = searchKPI(project,objectStr,stateStr,conditionStr,fields);
								log("SNO " +SNO+ " resultA="+resultA.length);
							}else{
								resultB = searchKPI(project,objectStr,stateStr,conditionStr,fields);
								log("SNO " +SNO+ " resultB="+resultB.length);
							}
						}
						var length1 = resultA.length;
						var length2 = resultB.length;
						log("length1 = " + length1);
						log("length2 = " + length2);
						log("length1-2 = " + (length1-length2));
						log("length1-2/1 = " + (length1-length2)/length1);
						var SNOVal = keepTwoDecimal((length1-length2),length1);
						kpiValue = kpiValue + SNO +"<:>"+ SNOVal +"%<;>";
					}else if("A/(A+B)*100" == formulaStr ){//两部分拆分计算数量，有可能有拆分显示
						log("A/(A+B)*100");
						var outObjectArr = calculationObject.split(innerSperator);//获取两个计算指标的查询对象数组，
						var outStateArr = calculationState?calculationState.split(innerSperator):undefined;//获取两个计算指标的查询状态数组，
						var outConditionArr = undefined;
						if(calculationCondition && calculationCondition!= null && calculationCondition!=''){
							outConditionArr = calculationCondition.split(innerSperator);//以;拆分查询条件
						}
						log("outConditionArr = " + (outConditionArr?outConditionArr.length:"undefined"));
						var resultA = [];
						var resultB = [];
						for(var outInd=0; outInd<outObjectArr.length; outInd++){
							var objectStr = outObjectArr[outInd];//获取查询数组，如果需要查询多个对象，拆分
							var stateStr = outStateArr && outStateArr[outInd]?outStateArr[outInd]:undefined;//获取查询状态数组，如果需要查询多个状态，拆分
							var conditionStr = outConditionArr?outConditionArr[outInd]:undefined;
							log("conditionStr="+conditionStr);
							if(outInd == 0){
								resultA = searchKPI(project,objectStr,stateStr,conditionStr,fields);
								log("SNO " +SNO+ " resultA="+resultA.length);
							}else{
								resultB = searchKPI(project,objectStr,stateStr,conditionStr,fields);
								log("SNO " +SNO+ " resultB="+resultB.length);
							}
						}
						var length1 = resultA.length;
						var length2 = resultB.length;
						var SNOVal = keepTwoDecimal(length1,(length1+length2));
						kpiValue = kpiValue + SNO + "<:>"+ SNOVal+"%<;>";
					}else{//当不符合以上任意表达式时，
						//实际记录字段不为空时；calculationObject只能查询一个对象，否则无法从记录字段获取数据
						if(calculationRecordField && calculationRecordField != ""){
							fields.push(calculationRecordField.trim());//需要查询实际查询字段
							var resultList = searchKPI(project,calculationObject,calculationState,calculationCondition,fields);
							log("SNO " +SNO+ " resultList=" + (resultList?resultList.length:0));
							if(splitFields.length>0){
								var splitKPIVal = getSplitValues(SNO,splitFields,calculationObject,calculationState,resultList,true,calculationRecordField);
								kpiValue = kpiValue + splitKPIVal + "<;>";
							}else{
								kpiValue = kpiValue + SNO + "<:>"+ (resultList.length)+"<;>";
							}
						}
					}
					log(kpiValue);
				}catch(e){
					log("Project=" + project+" | SNO=" + SNO +" 统计失败，Exception="+e);
				}
			}
		}catch(e){
			log("Project [ " + project + "] 统计失败，Exception="+e);
		}
		log("KPI Actual Value ="+kpiValue);
		kpiItem.setFieldValue("KPI Actual Value",kpiValue);
	}
}

/** 清空字符串内所有空格*/
function trimStr(str){
	if(!str || str == null || str == "null"){
		str = "";
	}
	var temp = new java.lang.String(str);
	temp = temp.replaceAll(' ',"");
	return temp;
}

/**
 * 去除换行
 * @param str
 * @returns {java.lang.String}
 */
function replaceNewline(str){
	if(!str || str == null || str == "null"){
		str = "";
	}
	var temp = new java.lang.String(str);
	temp = temp.replaceAll('\n',"");
	temp = temp.replaceAll('\r',"");
	return temp;
}

/**
 * 保证两位小数
 * @param num
 * @returns
 */

function keepTwoDecimal(num, num2) {
	log("num 1 = " + num +"num 2 = " + num2);
	var result = num/num2;
	log("result = " + result);
	if (isNaN(result)) {  
		return 0;  
	}
	result = parseFloat(result);
	log("result = " + result);
	if(result == 1){//如果结果为1，返回100
		return 100;
	}
	log(" result = " + (Math.round(result * 10000) / 100));
	return (Math.round(result * 10000) / 100); //小数点后两位百分比
}

/**
 * 拆分记录KPI值
 * @param SNO
 * @param splitFields
 * @param calculationObject
 * @param calculationState
 * @param resultList
 * @param realRecord
 * @returns {String}
 */
function getSplitValues(SNO,splitFields,calculationObject,calculationState,resultList,realRecord,calculationRecordField){
	var firstField = splitFields[0].trim();//拆分显示的第一个字段
	var splitFieldArr = firstField.split(":");
	var firstFieldName = splitFieldArr[0];
	var firstFieldValueStr = splitFieldArr[1];//第一个字段的可选值
	var firstFieldValues = [];//第一个字段的可选值
	var secondField = undefined;//拆分显示的第二个字段
	var secondFieldName = undefined;
	var secondFieldValueStr = [];//第二个字段的可选值
	var secondFieldValues = [];//第二个字段的可选值
	if(splitFields.length>1 ){
		secondField = splitFields[1].trim();
		var secSplitFieldArr = secondField.split(":");
		secondFieldName = secSplitFieldArr[0];
		secondFieldValueStr = secSplitFieldArr[1];
	}
	log("firstFieldName="+ firstFieldName);
	log("firstFieldValueStr="+ firstFieldValueStr);
	log("secondFieldName="+ secondFieldName);
	log("secondFieldValueStr="+ secondFieldValueStr);
	log(" first判断 " + (!firstFieldValueStr && firstFieldValueStr != null && firstFieldValueStr != 'null'));
	if(firstFieldValueStr && firstFieldValueStr != null && firstFieldValueStr != 'null'){//拆分出值
		log("firstFieldValueStr 拆分");
		firstFieldValues = firstFieldValueStr.split(innerComma);
	}else{
		if("Type" == firstFieldName){//如果是Type，直接从输入条件中获取显示Type
			firstFieldValues = calculationObject.split(innerOr);
		}else if("State" == firstFieldName){//如果是State，直接从输入条件中获取显示State
			firstFieldValues = calculationState.split(innerOr);
		}else if(undefined != firstFieldName){
			var fieldBean = server.getFieldBean(firstFieldName);//从PickList取值
			if(fieldBean){
				firstFieldValues = fieldBean.getPickFieldValues();
			}
		}
	}
	if(!secondFieldValueStr && secondFieldValueStr != null && secondFieldValueStr != 'null'){
		secondFieldValues = secondFieldValueStr.split(innerComma);
	}else{
		if("State" == secondFieldName){//如果是State，直接从输入条件中获取显示State
			secondFieldValues = calculationState.split(innerOr);
		}else if(undefined != secondFieldName){
			var fieldBean = server.getFieldBean(secondFieldName);//从PickList取值
			if(fieldBean){
				secondFieldValues = fieldBean.getPickFieldValues();
			}
		}
	}
	log("firstFieldValues="+ firstFieldValues.length);
	var splitKPIVal = SNO + "<:>";
	for(var fieldIndex=0; fieldIndex<firstFieldValues.length; fieldIndex++){//判断条件是否符合，并记录值到系统中
		var firstValue = firstFieldValues[fieldIndex]?new java.lang.String(firstFieldValues[fieldIndex].trim()):"";
		log("first Value  = " + firstValue);
		if(secondFieldValues && secondFieldValues.length>0 ){
			for(var secondIndex=0; secondIndex<secondFieldValues.length; secondIndex++){
				var secondValue = secondFieldValues[secondIndex]?new java.lang.String(secondFieldValues[secondIndex].trim()):"";
				log("secondValue  = " + secondValue);
				var count = 0;
				for(var resultIndex = 0; resultIndex<resultList.length; resultIndex++){//判断数据是否符合条件
					var resultObj = resultList[resultIndex];
					var resultFirstValue = resultObj[firstFieldName];
					var resultSecondValue = resultObj[secondFieldName];
					if(!resultFirstValue || resultFirstValue == null || resultFirstValue == "null"){
						resultFirstValue = "";
					}
					if(!resultSecondValue || resultSecondValue == null || resultSecondValue == "null"){
						resultSecondValue = "";
					}
					var resultFirstVal = new java.lang.String(resultFirstValue);
					var resultSecondVal = new java.lang.String(resultSecondValue);
					log("resultObj[" + firstFieldName + "]=" + resultFirstVal + "resultObj[" + secondFieldName + "]=" + resultSecondVal);
					log("first Value =" + (resultFirstVal.equals(firstValue) ) + " secondValue=" + (resultSecondVal.equals(secondValue) ));
					if(resultFirstVal.equals(firstValue) && resultSecondVal.equals(secondValue)){
						if(realRecord){//有字段记录值
							count = resultObj[calculationRecordField];//实际填写的值
							log("Real Record " +calculationRecordField+ " : " + count);
							break;
						}else{
							count++;
						}
					}
				}
				log("Record Val = " + count);
				splitKPIVal = splitKPIVal + firstValue + (secondValue?(innerAnd + secondValue):"") + ":"+count+ ",";
			}
		}else{
			var count = 0;
			for(var resultIndex = 0; resultIndex<resultList.length; resultIndex++){//判断数据是否符合条件
				var resultObj = resultList[resultIndex];
				var resultFirstValue = resultObj[firstFieldName];
				if(!resultFirstValue || resultFirstValue == null || resultFirstValue == "null"){
					resultFirstValue = "";
				}
				var resultFirstVal = new java.lang.String(resultFirstValue);
				log("resultObj[" + firstFieldName + "]=" + resultFirstVal);
				if(resultFirstVal.equals(firstValue)){
					if(realRecord){
						count = resultObj[calculationRecordField];//保存实际填写的值
						log("Real Record " +calculationRecordField+ " : " + count);
						break;
					}else{
						count++;
					}
				}
			}
			log("Record Val = " + count);
			splitKPIVal = splitKPIVal + firstValue + ":"+count + ",";
		}
	}
	if(splitKPIVal != "<:>"){
		splitKPIVal = splitKPIVal.substring(0,splitKPIVal.length-1);
	}
	return splitKPIVal;
}

/**
 * 根据条件搜索数据信息
 * @param project
 * @param calculationObject
 * @param calculationState
 * @param calculationCondition
 * @param fields
 * @returns {Array}
 */
function searchKPI(project,calculationObject,calculationState,calculationCondition,fields){
	log("calculationObject = " + calculationObject);
	log("calculationState = " + calculationState);
	var objectArr = calculationObject.split(innerOr);//获取查询数组，如果需要查询多个对象，拆分
	var stateArr = calculationState?calculationState.split(innerOr):undefined;//获取查询状态数组，如果需要查询多个状态，拆分
	var filterMap = new HashMap();//存储IBPL、Relationship等无法直接拼接到Query里面的过滤条件字段，用以过滤
	var queryDefinition = "((field[Project]="+project+") and (";//拼接类型条件
	var ibplFields = [];//记录ibpl 字段
	var ibplOperators = [];//ibpl关联条件
	var ibplValues = [];//记录ibpl 值
	var ibplAndConnect = false;//ibpl and 连接条件
	log("objectArr="+objectArr.length);
	if(objectArr.length>0){
		for(var objInd=0; objInd<objectArr.length; objInd++){
			log("Object = " + objectArr[objInd]);
			if(objInd == 0){
				queryDefinition = queryDefinition + "(field[Type]="+objectArr[objInd].trim()+")";
			}else{
				queryDefinition = queryDefinition + " or " + "(field[Type]="+objectArr[objInd].trim()+")";
			}
		}
		queryDefinition = queryDefinition + ")";//拼接类型条件
	}
	log("type::queryDefinition " + queryDefinition);
	if(stateArr && stateArr.length>0){
		log("stateArr="+stateArr.length);
		queryDefinition = queryDefinition + " and (";//拼接状态条件
		for(var objInd=0; objInd<stateArr.length; objInd++){
			log("State = " + stateArr[objInd]);
			if(objInd == 0){
				queryDefinition = queryDefinition + "(field[State]="+stateArr[objInd].trim()+")";
			}else{
				queryDefinition = queryDefinition + " or " + "(field[State]="+stateArr[objInd].trim()+")";
			}
		}
		queryDefinition = queryDefinition + ")";//拼接状态条件
	}
	log("state::queryDefinition " + queryDefinition);
	if(calculationCondition && calculationCondition != undefined && calculationCondition != 'undefined'
			&& calculationCondition!=null && calculationCondition!='null'){
		log("calculationCondition queryDefinition ="+calculationCondition);
		var conditionArr = conditionSplit(calculationCondition);//以;拆分查询条件
		log("conditionArr" + conditionArr.length);
		queryDefinition = queryDefinition + " and (";//拼接其他条件
		var conditionQuery = "";
		for(var objInd=0; objInd<conditionArr.length; objInd++){
			var conditions = conditionArr[objInd];// | 连接的单个条件
			log("objInd conditionQuery = " + conditionQuery);
			if(objInd > 0 ){
				conditionQuery = conditionQuery + " and (";//拼接其他条件
			}
			if(conditions.indexOf(innerOr)>-1 ){// | 连接
				log("append or : "+conditionFieldVal );
				conditionQuery = conditionQuery + "(";//拼接其他条件
				var conditionList = conditions.split(innerOr);//拆分数组
				log("conditionList = "+conditionList.length);
				for(var conIndex=0; conIndex<conditionList.length; conIndex++){
					var conditionFieldVal = conditionList[conIndex];
					if(conIndex>0){
						conditionQuery = conditionQuery + " or ";
					}
					var connectStr = getConnectOperator(conditionFieldVal);
					var condition = conditionFieldVal.split(connectStr);
					var field = condition[0].trim();
					var value = condition[1].trim();
					var fieldType = fieldMap.get(field);
					if(!fieldType || fieldType == null){
						var fieldBean = server.getFieldBean(field);
						fieldType = fieldBean.getFieldType();
						fieldMap.put(field,fieldType);
					}
					if("ibpl" == fieldType){//IBPL字段单独记录处理
						ibplFields.push(field);
						ibplOperators.push(connectStr);
						ibplValues.push(value);
					}
					log("condition conIndex "+conIndex+" field = " + field);
					log("condition value = " + value);
					fields.push(field);
					conditionQuery = conditionQuery + queryField(field,fieldType,connectStr,value);
					log("conIndex conditionQuery= " + conditionQuery);
				}
				conditionQuery = conditionQuery + ")";//拼接状态条件
			}else if(conditions.indexOf(innerAnd)>-1){// & 连接
				ibplAndConnect = true;
				log("append and : " + conditionFieldVal );
				var conditionList = conditions.split(innerAnd);//拆分数组
				queryDefinition = queryDefinition + "(";//拼接其他条件
				log("conditionList = "+conditionList.length);
				for(var conIndex=0; conIndex<conditionList.length; conIndex++){
					var conditionFieldVal = conditionList[conIndex];
					log("conditionFieldVal = " + conditionFieldVal);
					if(conIndex>0){
						conditionQuery = conditionQuery + " and ";
					}
					var connectStr = getConnectOperator(conditionFieldVal);
					var condition = conditionFieldVal.split(connectStr);
					var field = condition[0].trim();
					var value = condition[1].trim();
					log("condition conIndex "+conIndex+" field = " + field);
					log("condition value = " + value);
					var fieldType = fieldMap.get(field);
					if(!fieldType || fieldType == null){
						var fieldBean = server.getFieldBean(field);
						fieldType = fieldBean.getFieldType();
						fieldMap.put(field,fieldType);
					}
					if("ibpl" == fieldType){//IBPL字段单独记录处理
						ibplFields.push(field);
						ibplOperators.push(connectStr);
						ibplValues.push(value);
					}
					fields.push(field);
					conditionQuery = conditionQuery + queryField(field,fieldType,connectStr,value);
					log("conIndex conditionQuery= " + conditionQuery);
				}
				conditionQuery = conditionQuery + ")";//拼接状态条件
			}else{//单字段
				log("append single : "  + conditions);
				conditionQuery = conditionQuery + "(";//拼接其他条件
				var connectStr = getConnectOperator(conditions);
				log("connectStr = " + connectStr);
				var condition = conditions.split(connectStr);
				log("condition = " + condition)
				var field = condition[0].trim();
				var value = condition[1].trim();
				log("condition field = " + field);
				log("condition value = " + value);
				var fieldType = fieldMap.get(field);
				if(!fieldType || fieldType == null){
					var fieldBean = server.getFieldBean(field);
					fieldType = fieldBean.getFieldType();
					fieldMap.put(field,fieldType);
				}
				if("ibpl" == fieldType){//IBPL字段单独记录处理
					ibplFields.push(field);
					ibplOperators.push(connectStr);
					ibplValues.push(value);
				}
				fields.push(field);
				var query = queryField(field,fieldType,connectStr,value);
				log("query = " + query);
				conditionQuery = conditionQuery + query;
				conditionQuery = conditionQuery + ")";//拼接状态条件
				log("conIndex conditionQuery= " + conditionQuery);
			}
		}
		queryDefinition = queryDefinition + conditionQuery + ")";//拼接其他条件
		log("condtion::" + queryDefinition);
	}
	queryDefinition = queryDefinition + ")";//总条件添加)
	log("All QueryDefinition = " + queryDefinition);
	if(queryDefinition.indexOf(emptyQueryCondition)>-1){//去除空查询条件
		queryDefinition = queryDefinition.replace(emptyQueryCondition,"");
	}else if(queryDefinition.indexOf("and ()")>-1){
		queryDefinition = queryDefinition.replace("and ()","");
	}
	if(queryDefinition.indexOf("()")>-1){
		queryDefinition = queryDefinition.replace("()","");
	}
	log("All QueryDefinition = " + queryDefinition);
	var results = findByConformanceIssue(queryDefinition,fields);
	if(ibplFields.length>0){//如果需要判断ibpl字段，使用Contains判断
		var returnResult = [];
		for(var i=0;i<results.length;i++){
			var resultObj = results[i];
			var canAdd = ibplAndConnect?true:false;//or连接假定不符合，and连接假定符合
			log("IBPL OBJ =" + resultObj);
			log("ibplAndConnect = " + ibplAndConnect);
			for(var index=0;index<ibplFields.length;index++){
				var ibplField = ibplFields[index];
				var ibplValue = ibplValues[index]?new java.lang.String(ibplValues[index]):"noneValue";
				var ibplOperator = ibplOperators[index];
				var resultIbplValue = resultObj[ibplField]?new java.lang.String(resultObj[ibplField]):"";
				log("ibplField = " + ibplField +" ibplValue = " + ibplValue + " ibplOperator = " + ibplOperator + " resultIbplValue = "+ resultIbplValue );
				if(ibplAndConnect){//and连接
					if(ibplOperator == "="){//包含判断
						if(resultIbplValue.indexOf(ibplValue) < 0){//只要有一个不包含，不添加
							canAdd = false;
						}
					}else if(ibplOperator == "!="){
						if(resultIbplValue.indexOf(ibplValue) > -1){//只要有一个包含，不添加
							canAdd = false;
						}
					}
				}else{//or连接
					if(ibplOperator == "="){//包含判断
						if(resultIbplValue.indexOf(ibplValue) > -1){//只要有一个包含，添加
							canAdd = true;
						}
					}else if(ibplOperator == "!="){
						if(resultIbplValue.indexOf(ibplValue) < 0){//只要有一个不包含，添加
							canAdd = true;
						}
					}
				}
			}
			if(canAdd)
				returnResult.push(resultObj);
		}
		return returnResult;
	}
	return results;
}

/**
 * 以 () 获取所有连接条件
 */
function conditionSplit(conditionStr){
	var resultArr = [];
	if(conditionStr.indexOf(innerBegin)>-1){
		log("conditionSPlit has()");
		var tempStr = conditionStr;
		var beginIndex = tempStr.indexOf(innerBegin);
		log("conditionSPlit ()"+beginIndex);
		while(beginIndex>-1){
			if(beginIndex!=0){//如果(不在位置0，将0到(的条件记录
				var preCondition = tempStr.substring(0,beginIndex);
				resultArr.push(preCondition);
			}
			var endIndex = tempStr.indexOf(innerEnd);
			var postCondition = tempStr.substring(beginIndex,endIndex);
			resultArr.push(postCondition);
			tempStr = tempStr.substring(endIndex + 1);
			beginIndex = tempStr.indexOf(innerBegin);
		}
	}else{
		log("conditionSPlit no()");
		resultArr.push(conditionStr);
	}
	return resultArr;
}

/*
 * 获取连接符号
 *  innerEq   "=";//KPI内容，连接条件
 *  innerUneq   "!=";//KPI内容，连接条件
 *  innerLarger   ">";
 *  innerLargerEqu   ">=";
 *  innerSmall   "<";
 *  innerSmallEqu   "<=";
 */
function getConnectOperator(conditionFieldVal){
	if(conditionFieldVal.indexOf(innerUneq)>-1){
		return innerUneq;
	}else if(conditionFieldVal.indexOf(innerEq)>-1){
		return innerEq;
	}else if(conditionFieldVal.indexOf(innerLargerEqu)>-1){
		return innerLargerEqu;
	}else if(conditionFieldVal.indexOf(innerLarger)>-1){
		return innerLargerEqu;
	}else if(conditionFieldVal.indexOf(innerSmallEqu)>-1){
		return innerSmallEqu;
	}else if(conditionFieldVal.indexOf(innerSmall)>-1){
		return innerSmall;
	}
	return "";
}

/**
 * 根据字段类型拼接查询条件
 */
function queryField(field,fieldType,operator,value){
	log("QUERY FILTER：Field = " + field + " | fieldType = " + fieldType + " | operator = " + operator +" | value = " + value);
	var preOpeator = operator == '!='?' ( not ' :'';
	var result = "";
	if('unspecified' == value || 'undefined' == value){//unspecified值定义，需要用is赋值
		log("queryField = " + "(field[" + field + "] contains " + value + ")");
		result = preOpeator + "(field[" + field + "] is unspecified )";
	}else{
		if('shorttext' == fieldType || 'longtext' == fieldType){
			log("queryField = " + "(field[" + field + "] contains " + value + ")");
			result = preOpeator + "(field[" + field + "] contains " + value + ")";
		}else if('loggingtext' == fieldType){
			log("queryField = " + preOpeator + "(field[" + field + "]=" + value + ")");
			result = preOpeator + "(field[" + field + "]=" + value + ")";
		}else if('ibpl' == fieldType || 'relationship' == fieldType){
			//IBPL, Relationship 字段 判断需要查询后，循环根据字段判断
			return result;
		}else if('pick' == fieldType || 'int' == fieldType || 'boolean' == fieldType 
				|| 'float' == fieldType || 'phase' == fieldType){
			log("queryField = " + preOpeator + "(field[" + field + "]=" + value + ")");
			result = preOpeator + "(field[" + field + "]=" + value + ")";
		}else if('user' == fieldType || 'group' == fieldType){
			log("queryField = " + preOpeator + "(field[" + field + "]=" + value + ")");
			result = preOpeator + "(field[" + field + "]=" + value + ")";
		}else if('date' == fieldType){//
			if(operator == "!="){// = 连接，只能是today ,yesterday, tomorrow
				result = "(field[" + field + "] " + value + ")";
			}else if(operator == "!="){//!= 连接，只能是today ,yesterday, tomorrow
				result = "not (field[" + field + "] " + value + ")";
			}else if(operator == "<" || operator == "<="){
				var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
				log("sdf");
				var sdf2 = new java.text.SimpleDateFormat("MMM d, yyyy");
				log("sdf2");
				var beginDate = new java.util.Date();
				log("beginDate = " + beginDate);
				if("today" == value){//默认是当天
					
				}else if("tomorrow" == value){//明天
					beginDate = beginDate.setDate(beginDate.getDate()+1);
				}else{//格式化输入时间， yyyy-MM-dd
					beginDate = sdf.parse(value);
				}
				if(operator == "<"){
					beginDate = beginDate.setDate(beginDate.getDate()+1);
				}
				var endDate = new java.util.Date(beginDate.getTime());
				log("endDate = " + endDate);
				endDate.setYear(endDate.getYear()+1);//设置比开始时间大一年
				var beginValue = sdf2.format(beginDate);
				log("beginValue = " + beginValue);
				var endValue = sdf2.format(endDate);
				log("endValue = " + endValue);
				result = "(field[" + field + "] between "+ beginValue + " and " + endValue+")";
			}else{//当大于时，设置起始时间为2019年5月30号，系统干正式部署时间
				var beginValue = "May 30, 2019";
				var endDate = new java.util.Date();
				var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
				var sdf2 = new java.text.SimpleDateFormat("MMM d, yyyy");
				if("today" == value){
					
				}else if("yesterday" == value){
					endDate = endDate.setDate(endDate.getDate()+1);
				}else if("tomorrow" == value){//明天
					endDate = endDate.setDate(endDate.getDate()+1);
				}else{//格式化输入时间， yyyy-MM-dd
					endDate = sdf.parse(value);
				}
				if(operator == ">"){
					endDate = endDate.setDate(endDate.getDate()-1);
				}
				var endValue = sdf2.format(endDate);
				result = "(field[" + field + "] between "+ beginValue + " and " + endValue;
			}
			log("field query condition = " + result);
			return result ;
		}
	}
	if(preOpeator != ''){//如果是not拼接，后面需要拼接)
		result = result +")";
	}
	return result;
}

function findByConformanceIssue(queryDefinition,fields){
	var resultList = [];
	//定义容器
	var mv = new Packages.com.mks.api.MultiValue();
	mv.setSeparator(",");
	//添加字段
	mv.add("ID");
	if(fields){
		for(var i=0; i<fields.length; i++){
			mv.add(fields[i]);
		}
	}
	//sessionBean
	var sessionBean = eb.createAPISessionBean();
	//cmd对象
	var cmd  = new Packages.com.mks.api.Command("im","issues");

	//添加查询项
	cmd.addOption(new Packages.com.mks.api.Option("fields",mv));
	cmd.addOption(new Packages.com.mks.api.Option("hostname",mksHost));
	cmd.addOption(new Packages.com.mks.api.Option("user","admin"));
	cmd.addOption(new Packages.com.mks.api.Option("password",passwd));
	cmd.addOption(new Packages.com.mks.api.Option("queryDefinition",queryDefinition));
	var response = sessionBean.executeCmd(cmd);
	var it = response.getWorkItems(); 
	
	while(it.hasNext()){
		var wi = it.next();
		var id = wi.getField("ID").getValue();   
		var resultObj = {ID:id};
		for(var i=0; i<fields.length; i++){
			var fieldName = fields[i];
			var fieldValue = wi.getField(fieldName).getValueAsString();
			resultObj[fieldName] =fieldValue;
		}
		resultList.push(resultObj);
	}
	return resultList;
}

log("------------------------- KPI start to calculation------------------------");
main();
log("------------------------- KPI end to calculation  -------------------------");

