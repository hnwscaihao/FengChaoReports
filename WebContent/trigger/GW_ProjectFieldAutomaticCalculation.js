// <b>GW_ProjectFieldAutomatic Calaculation</b>
// <p>
// MKS ALM 2009 solution
// <p>
//Automatic calculation of the indicators of the project kpi report
// <p>
// This trigger is a pre-trigger.
// <p>
// <p>
// Author : William Lee.
// Create Date : 2019-3-16
// </p>
//
// @param String passwd


importPackage(Packages.javax.activation);
importPackage(Packages.com.mks.api);
function abort(s){
    eb.abortScript(s, true);
}

function log(s){
    Packages.mks.util.Logger.message(s);
}

var eb = bsf.lookupBean("siEnvironmentBean");

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



function percentNum(num, num2) {
	if(num2==0 && num ==0){
		return 0 +"%";
	}else if(num===0 || !num){
		return 0 +"%";
	}
	return (Math.round(num / num2 * 100)  + "%"); //小数点后两位百分比
}


function main(){
	if(!allItemIds || allItemIds.length == 0){
		return;
	}
	log("...Schedual Send Item Length =" + allItemIds.length);
	for(var i=0; i<allItemIds.length; i++){//循环到所有要的数据
		
		var decomposedFromTraceCount = 0;
		var systemNodeTotalCount=0;
		
		var architectesFromTraceCount =0;
		var architectesTotalCount=0; 
		
		var satisfiesTraceCount =0; 
		var satisfiesTotalCount =0;
		
		var arichitectedTraceCount=0;
		var arichitectedSoftwareTotalCount =0;
		
		var defectClosedCount = 0;
		var defectCount = 0;  
		
		var defectReviewCount = 0;
		var defectReviewClosed = 0;
		var totalRequiremntCount = new java.lang.Integer(0);
		var changeOrderRequirementCount=new java.lang.Integer(0);
		var issueDeltaBean = server.getIssueDeltaBean(allItemIds[i]);  
		var type = issueDeltaBean.getType();
		var projectState = issueDeltaBean.getState();
		if(projectState=="Defined"){
			continue;
		}
		log("-----------------一个项目循环开始-------------------------")
		var project = issueDeltaBean.getNewProject();
		if(type=="Project"){ 
			var documentObject = issueDeltaBean.getNewRelatedIssues("Documented By");
			log("project- :"+project+"--documentObjectLength:"+ documentObject.length)
			for(var j =0;j<documentObject.length;j++){
				var documentIssueBean = server.getIssueDeltaBean(documentObject[j]);
				var documentsType = documentIssueBean.getType();
				var documentState = documentIssueBean.getState();
				if(documentState!="Inactive"){ //添加非Inactive
				var documentType  = new java.lang.String(documentsType);
				var ids = [];
				ids[0] = documentIssueBean.getID(); 
						//做所有文档下条目的过滤
												
												var contentFieldBean = server.getContainsFieldBean();//拿到包含条目Bean
												var returnIds = server.walkHierarchy(ids,[contentFieldBean],false); //使用文档ID和包含条目Bean 查询所有文档ID下包含的条目
												var strField = new java.lang.String("Changes Authorized By");
												if(returnIds.length>0){
														var customBean = server.getFieldBean(strField); 
														var beans = server.getIssueBeans(returnIds ,[customBean]); 
														for(var o=0; o<beans.length; o++){
															var nodeBean =  server.getIssueDeltaBean( beans[o].getID() );
															var category = nodeBean.getFieldValue("Category");
															if(category!="Heading" && category!="Comment"){//增加Heading 和 Comment校验
																totalRequiremntCount++;
																var validatas =  nodeBean.getNewRelatedIssues("Changes Authorized By"); 			
																if(validatas.length>=1){
																	changeOrderRequirementCount++;
																}
															}							
														}
												}
																						
												
												log("文档类型："+documentType+"-文档ID："+ids[0] +"项目：--"+ project);	      
												if(documentType == "System Requirement Specification Document"){
													
														var contentFieldBean = server.getContainsFieldBean();//拿到包含条目Bean
														var returnIds = server.walkHierarchy(ids,[contentFieldBean],false); //使用文档ID和包含条目Bean 查询所有文档ID下包含的条目
														var strField = new java.lang.String("Decomposed From");
														if(returnIds.length>0){
																var customBean = server.getFieldBean(strField); 
																var beans = server.getIssueBeans(returnIds ,[customBean]); 
																for(var o=0; o<beans.length; o++){
																	var nodeBean =  server.getIssueDeltaBean( beans[o].getID() );
																	var category = nodeBean.getFieldValue("Category");
																	if(category!="Heading" && category!="Comment"){//增加Heading 和 Comment校验
																		systemNodeTotalCount++;
																		var validatas =  nodeBean.getNewRelatedIssues("Decomposed From"); 			
																		if(validatas.length>=1){
																			decomposedFromTraceCount++;
																		}
																	}							
																}
														}
													
												}else if(documentType=="System Architectural Design Specification Document"){
														
														var contentFieldBean = server.getContainsFieldBean();//拿到包含条目Bean
														var returnIds = server.walkHierarchy(ids,[contentFieldBean],false); //使用文档ID和包含条目Bean 查询所有文档ID下包含的条目
														var strField = new java.lang.String("Architectes From");
														if(returnIds.length>0){
																var customBean = server.getFieldBean(strField); 
																var beans = server.getIssueBeans(returnIds ,[customBean]); 
																for(var o=0; o<beans.length; o++){
																	var nodeBean =  server.getIssueDeltaBean( beans[o].getID() );
																	var category = nodeBean.getFieldValue("Category");
																	if(category!="Heading" && category!="Comment"){//增加Heading 和 Comment校验
																		satisfiesTotalCount++;
																		var validatas =  nodeBean.getNewRelatedIssues("Architectes From"); 			
																		if(validatas.length>=1){
																			architectesFromTraceCount++;
																		}
																	}							
																}
														}
												}else if(documentType=="Software Requirement Specification Document"){
														
														var contentFieldBean = server.getContainsFieldBean();//拿到包含条目Bean
														var returnIds = server.walkHierarchy(ids,[contentFieldBean],false); //使用文档ID和包含条目Bean 查询所有文档ID下包含的条目
														var strField = new java.lang.String("Architected By");
														if(returnIds.length>0){
																var customBean = server.getFieldBean(strField); 
																var beans = server.getIssueBeans(returnIds ,[customBean]); 
																for(var o=0; o<beans.length; o++){
																	var nodeBean =  server.getIssueDeltaBean( beans[o].getID() );
																	var category = nodeBean.getFieldValue("Category");
																	if(category!="Heading" && category!="Comment"){//增加Heading 和 Comment校验
																		arichitectedSoftwareTotalCount++;
																		var validatas =  nodeBean.getNewRelatedIssues("Architected By"); 			
																		if(validatas.length>=1){
																			arichitectedTraceCount++;
																		}
																	}							
																}
														}
												}else if(documentType=="Software Requirement Specification Document"){
														var contentFieldBean = server.getContainsFieldBean();//拿到包含条目Bean
														var returnIds = server.walkHierarchy(ids,[contentFieldBean],false); //使用文档ID和包含条目Bean 查询所有文档ID下包含的条目
														var strField = new java.lang.String("Satisfies");
														if(returnIds.length>0){
																var customBean = server.getFieldBean(strField); 
																var beans = server.getIssueBeans(returnIds ,[customBean]); 
																for(var o=0; o<beans.length; o++){
																	var nodeBean =  server.getIssueDeltaBean( beans[o].getID() );
																	var category = nodeBean.getFieldValue("Category");
																	if(category!="Heading" && category!="Comment"){//增加Heading 和 Comment校验
																		architectesTotalCount++;
																		var validatas =  nodeBean.getNewRelatedIssues("Satisfies"); 			
																		if(validatas.length>=1){
																			satisfiesTraceCount++;
																		}
																	}							
																}
														}
												}											
				}
			}
			

		//干系人需求总数
		var StakeholderRequirementsTotal = findByCountQuery(project,"Stakeholder Requirement Document");
		//系统需求总数
		var SystemRequirementsTotal = findByCountQuery(project,"System Requirement Specification Document");
		//软件需求总数
		var SoftwareRequirementsTotal = findByCountQuery(project,"Software Requirement Specification Document");
		issueDeltaBean.setFieldValue("Stakeholder Requirements Total",StakeholderRequirementsTotal);
		issueDeltaBean.setFieldValue("System Requirements Total",SystemRequirementsTotal); 
		issueDeltaBean.setFieldValue("Software Requirements Total",SoftwareRequirementsTotal);
		//统计关联了changeorder条目的百分比
		log("ch2222222222222222222222222222222222222222222222222222222222222222222222222222222rder:--"+changeOrderRequirementCount);
        log("11111111111111111111111111111111111111111111111111111111111111:--"+totalRequiremntCount);
		var changeOrderCalcCount = percentNum(changeOrderRequirementCount,totalRequiremntCount);
		
		issueDeltaBean.setFieldValue("Calc ChangeOrder Count",changeOrderCalcCount);
        
         
		//统计干系人追溯系统需求的的百分比
		//log("系统需求条目总数:--"+systemNodeTotalCount);
		//log("干系人追溯系统需求数:--"+decomposedFromTraceCount);
		//log("统计干系人的百分比:--"+percentNum(decomposedFromTraceCount,systemNodeTotalCount));
		var decomposedCount = percentNum(decomposedFromTraceCount,systemNodeTotalCount)
		issueDeltaBean.setFieldValue("Decomposed From Trace Count",decomposedCount);
		
		//统计系统架构中系统需求的百分比
		//log("系统架构条目总数:--"+satisfiesTotalCount);
		//log("系统需求追溯系统架构数:--"+architectesFromTraceCount);
		//log("统计系统架构的百分比:--"+percentNum(architectesFromTraceCount,satisfiesTotalCount));
		var architectesCount = percentNum(architectesFromTraceCount,satisfiesTotalCount)
		issueDeltaBean.setFieldValue("Architectes From Trace Count",architectesCount); 
		//统计系统需求追溯软件需求的百分比
		//log("软件需求条目总数:--"+architectesTotalCount);
		//log("系统需求追溯软件需求数:--"+satisfiesTraceCount);
		//log("统计系统需求的百分比:--"+percentNum(satisfiesTraceCount,architectesTotalCount));
		var satisfiesCount = percentNum(satisfiesTraceCount,architectesTotalCount);
		issueDeltaBean.setFieldValue("Satisfies Form Trace Count",satisfiesCount);  

		//log("软件需求条目总数:--"+arichitectedSoftwareTotalCount);
		//log("系统需求追溯软件需求数:--"+arichitectedTraceCount);
		//log("统计系统需求的百分比:--"+percentNum(arichitectedTraceCount,arichitectedSoftwareTotalCount));
		var arichitectedSoftwareCount = percentNum(arichitectedTraceCount,arichitectedSoftwareTotalCount);
		issueDeltaBean.setFieldValue("Architected Form Software Trace Count",arichitectedSoftwareCount); 
		//------------------------------------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------------------------------------------------------------
		
		 //Test Objective中有测试结果的软件单元测试用例
		  var tSoftwareUnitResults = findByTestCaseQuery(project,"Test Case","Software Unit Test");
		  var tSoftwareUnitCount = percentNum(tSoftwareUnitResults[0],tSoftwareUnitResults[1]);
		  log("Test Objective中所有的软件单元测试用例   :--"+ tSoftwareUnitResults[1]);
		  log("Test Objective中有测试结果的软件单元测试用例 :--"+ tSoftwareUnitResults[0]);
		  issueDeltaBean.setFieldValue("Test Objective Software Unit Result Percentage",tSoftwareUnitCount);
		  issueDeltaBean.setFieldValue("Test Objective Software Unit Result Count",tSoftwareUnitResults[1]); 
		 
		 //Test Objective中有测试结果的系统确认测试用例 
		  var testSysQualificationResults = findByTestCaseQuery(project,"Test Case","System Qualification Test");
		  var TORequirementP = percentNum(testSysQualificationResults[0],testSysQualificationResults[1]);
		  log("Test Objective中有测试结果的系统确认测试用例 :--"+ TORequirementP);
		  issueDeltaBean.setFieldValue("Test Objective Requirement Result Percentage",TORequirementP);
		  issueDeltaBean.setFieldValue("Test Objective Requirement Result Count",testSysQualificationResults[1]);//Test Objective中所有的系统确认测试用例

		 	
		//Test Objective中有测试结果的系统集成测试用例 
		 var results = findByTestCaseQuery(project,"Test Case","System Integration Test");
	     var TOIntegrationP = percentNum(results[0],results[1]);
		 log("Test Objective中有测试结果的系统集成测试用例 :--"+ TOIntegrationP);
		 issueDeltaBean.setFieldValue("Test Objective Integration Result Percentage",TOIntegrationP);
		 issueDeltaBean.setFieldValue("Test Objective Integration Result Count",results[1]);//Test Objective中所有的系统集成测试用例 
		
	 
		 
		  //Test Objective中有测试结果的软件集成测试用例
		   var tSoftwareIntegrationResults = findByTestCaseQuery(project,"Test Case","Software Integration Test");
		   var tSoftwareIntegrationCount = percentNum(tSoftwareIntegrationResults[0],tSoftwareIntegrationResults[1]);
		   log("Test Objective中所有的软件集成测试用例   :--"+ tSoftwareIntegrationResults[1]);
		   log("Test Objective中有测试结果的软件集成测试用例 :--"+ tSoftwareIntegrationCount);
		   issueDeltaBean.setFieldValue("Test Objective Software Integration Result Percentage",tSoftwareIntegrationCount);
		   issueDeltaBean.setFieldValue("Test Objective Software Integration Result Count",tSoftwareIntegrationResults[1]); 
		   
		  //Test Objective中有测试结果的软件确认测试用例 
		  var tSoftwareQualificationResults = findByTestCaseQuery(project,"Test Case","Software Qualification Test");
		  var tSoftwareQualificationCount = percentNum(tSoftwareQualificationResults[0],tSoftwareQualificationResults[1]);
		  log("Test Objective中所有的软件确认测试用例   :--"+ tSoftwareQualificationResults[1]);
		  log("Test Objective中有测试结果的软件确认测试用例 :--"+ tSoftwareQualificationCount);
		  issueDeltaBean.setFieldValue("Test Objective Software Confirm Result Percentage",tSoftwareQualificationCount);
		  issueDeltaBean.setFieldValue("Test Objective Software Confirm Result Count",tSoftwareQualificationResults[1]); 
		  
		  
		  
		//已解决的系统集成测试相关的缺陷
		var  defectSysIntegrationResults 	  =	results[3];
		log("已解决的系统集成测试相关的缺陷"+defectSysIntegrationResults[0]);
		log("所有系统集成相关的缺陷"+defectSysIntegrationResults[1]);
		var defectI = percentNum(defectSysIntegrationResults[0],defectSysIntegrationResults[1]);
		issueDeltaBean.setFieldValue("Defect Pass Architectes Percentage",defectI);
		issueDeltaBean.setFieldValue("Defect System Architectes Count",defectSysIntegrationResults[1]); 	//B：所有系统集成相关的缺陷  
		  
		//已解决的系统确认测试相关的缺陷
		 var  defectSysQualificationResults 	  =	testSysQualificationResults[3];
		 log("已解决的系统集成测试相关的缺陷"+defectSysQualificationResults[0]);
		 log("所有系统集成相关的缺陷"+defectSysQualificationResults[1]);
		 var defectII = percentNum(defectSysQualificationResults[0],defectSysQualificationResults[1]);
		 issueDeltaBean.setFieldValue("Defect Pass Requirement Percentage",defectII);
		 issueDeltaBean.setFieldValue("Defect Pass Requirement Count",defectSysQualificationResults[1]); 	//B：所有系统确认相关的缺陷
		
		//已解决的软件单元测试相关的缺陷
		 var  defectSoftwareUnitResults 	  =	tSoftwareUnitResults[3];
		 log("已解决的软件单元测试相关的缺陷"+defectSoftwareUnitResults[0]);
		 log("所有软件单元测试相关的缺陷"+defectSoftwareUnitResults[1]);
		 var defectIII = percentNum(defectSoftwareUnitResults[0],defectSoftwareUnitResults[1]);
		 issueDeltaBean.setFieldValue("Defect Pass Software Unit Percentage",defectIII);
		 issueDeltaBean.setFieldValue("Defect Software Software Unit Count",defectSoftwareUnitResults[1]); 	//B：软件单元测试缺陷
		
		  //已解决的软件集成测试相关的缺陷	 
		 var  DefectSoftwareIntegrationResults 	 =	tSoftwareIntegrationResults[3];
		 log("已解决的软件集成测试相关的缺陷"+DefectSoftwareIntegrationResults[0]);
		 log("所有软件集成测试相关的缺陷"+DefectSoftwareIntegrationResults[1]);
		 var defectIIII = percentNum(DefectSoftwareIntegrationResults[0],DefectSoftwareIntegrationResults[1]);
		 issueDeltaBean.setFieldValue("Defect Pass Software Integration Percentage",defectIIII);
		 issueDeltaBean.setFieldValue("Defect Software Integration Count",DefectSoftwareIntegrationResults[1]);  


		//已解决的软件确认测试相关的缺陷	 
		 var  DefectSoftwareConfimResults 	 =	tSoftwareQualificationResults[3];
		 log("已解决的软件确认测试相关的缺陷"+DefectSoftwareConfimResults[0]);
		 log("B：所有软件确认测试相关的缺陷"+DefectSoftwareConfimResults[1]);
		 var defectIIIII = percentNum(DefectSoftwareConfimResults[0],DefectSoftwareConfimResults[1]);
		 issueDeltaBean.setFieldValue("Defect Pass Software Confirm Percentage",defectIIIII);
		 issueDeltaBean.setFieldValue("Defect Software Confirm Count",DefectSoftwareConfimResults[1]); 		   
		 
		 
		 var conformanceIssueResutlts =  findByConformanceIssue(project,"Non-Conformance Issue"); 
		 var conformanceI = percentNum(conformanceIssueResutlts[0],conformanceIssueResutlts[1]);
		 var conformanceII = percentNum(conformanceIssueResutlts[2],conformanceIssueResutlts[3]);
		 var conformanceIII = percentNum(conformanceIssueResutlts[4],conformanceIssueResutlts[5]);
		 log("conformanceIssueResutlts"+conformanceIssueResutlts[0])
		 log("conformanceIssueResutlts"+conformanceIssueResutlts[1])
		 log("conformanceIssueResutlts"+conformanceIssueResutlts[2])
		 log("conformanceIssueResutlts"+conformanceIssueResutlts[3])
		 log("conformanceIssueResutlts"+conformanceIssueResutlts[4])
		 log("conformanceIssueResutlts"+conformanceIssueResutlts[5])
		 issueDeltaBean.setFieldValue("Conformance Issue Pass Percentage",conformanceI);
		 issueDeltaBean.setFieldValue("Conformance Issue Count",conformanceIssueResutlts[1]);
		 issueDeltaBean.setFieldValue("Conformance Issue Pass Configuration Percentage",conformanceII);
		 issueDeltaBean.setFieldValue("Conformance Issue Configuration Count",conformanceIssueResutlts[3]);
		 issueDeltaBean.setFieldValue("Conformance Issue  Resolving non-conformities",conformanceIII);
		 issueDeltaBean.setFieldValue("Conformance Issue Change Request audit Count",conformanceIssueResutlts[5]); 
		 
		
						
		 
		 
		 var defectsResutlts =  findbyDefectCount(project,"Defect"); 
		 log("1:-"+defectsResutlts[0]);
		 log("2:-"+defectsResutlts[1]);
		 log("3:-"+defectsResutlts[2]);
		 log("4:-"+defectsResutlts[3]);
		 // //统计defect Closed 状态的百分比
		 var defectCountPercentage = percentNum(defectsResutlts[0],defectsResutlts[1]);
		 issueDeltaBean.setFieldValue("Defect Closed Percentage",defectCountPercentage);
		 issueDeltaBean.setFieldValue("Defect Close Total Count",defectsResutlts[1]);
		 var defectReviewPercentag = percentNum(defectsResutlts[2],defectsResutlts[3]);
		// //已解决的Review相关的缺陷
		log("defectReviewPercentag--"+defectReviewPercentag);
		log("Defect Pass Software Review Count--"+defectsResutlts[3]);
		 issueDeltaBean.setFieldValue("Defect Pass Software Review Percentage",defectReviewPercentag);
		 issueDeltaBean.setFieldValue("Defect Pass Software Review Count",defectsResutlts[3]); 	//所有Review相关的缺陷
		
		log("-----------------一个项目循环结束-------------------------");
		}
	   
	}	 
	
	
	
	
	 
	
	
} 
function itemCalculation(field,ids){
		var count = 0;
		var	calcCount =0;		
		var contentFieldBean = server.getContainsFieldBean();//拿到包含条目Bean
		var returnIds = server.walkHierarchy(ids,[contentFieldBean],false); //使用文档ID和包含条目Bean 查询所有文档ID下包含的条目
		var strField = new java.lang.String(field);
		if(returnIds.length>0){
				var customBean = server.getFieldBean(strField); 
				var beans = server.getIssueBeans(returnIds ,[customBean]); 
				for(var o=0; o<beans.length; o++){
					var nodeBean =  server.getIssueDeltaBean( beans[o].getID() );
					var category = nodeBean.getFieldValue("Category");
					if(category!="Heading" && category!="Comment"){//增加Heading 和 Comment校验
						count++;
						var validatas =  nodeBean.getNewRelatedIssues(strField); 			
						if(validatas.length>=1){
							calcCount++;
						}
					}
													
				}
		}
		var  results = [];
		results[0] = calcCount;
		results[1] = count;
		return results;
}
function findbyDefectCount(project,type){
	//定义容器
	var mv = new Packages.com.mks.api.MultiValue();
	mv.setSeparator(","); 
	mv.add("ID");
	
	//获取Project字段value值
	var projectVal = project; 
	
	//查询定义
	
	var queryDefinition="((field[Project]="+projectVal+")  and  (field[Type]= "+type+"))";
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
	//执行cmd
	var response = sessionBean.executeCmd(cmd);
	
	var defectClosedCount =0;
	var defectCount =0;
	var defectCountPercentage =0;
	var defectReviewCount=0;
	
	var it = response.getWorkItems(); 
	var defectIDList = new java.util.ArrayList();
	
	while(it.hasNext()){
		var wi = it.next();
		var documentId = wi.getField("ID").getValue();  
		
		defectIDList.add(documentId);
		} 
		 
	if(defectIDList.size()>0){
		for(var x=0;x<defectIDList.size();x++){
			var IssueDeltaBean  = server.getIssueDeltaBean( defectIDList.get(x) );  
				var defectState  = IssueDeltaBean.getState();  
				var defectReview  = IssueDeltaBean.getNewFieldValue("Defect Source");  
				
				defectCount++;
				
				log("defectState:"+defectState+"--Source:--"+defectReview+"--ID:--"+defectIDList.get(x));
					if(defectState=="Closed"){
						defectClosedCount++;  
					} 
					if(defectReview){
						if(defectReview!="Code" && defectReview!="Test" && defectState=="Closed"){
							 defectCountPercentage++;
						} 
						if(defectReview!="Code" && defectReview!="Test"){
							 defectReviewCount++;
						}
					}
		} 
	} 
	
		var  results = [];
		results[0] = defectClosedCount;
		results[1] = defectCount;
		results[2] = defectCountPercentage;
		results[3] = defectReviewCount;
		return results;
	
}
function findByConformanceIssue(project,type){
	//定义容器
	var mv = new Packages.com.mks.api.MultiValue();
	mv.setSeparator(",");
	
	//添加字段
	
	mv.add("ID");
	mv.add("Process area");
	mv.add("State");
	
	//获取Project字段value值
	var projectVal = project; 
	
	//查询定义
	
	var queryDefinition="((field[Project]="+projectVal+")  and  (field[Type]= "+type+"))";
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

	//执行cmd
	var response = sessionBean.executeCmd(cmd);
	var closedNoConfCount =0;
	var allNoConfCount=0;
	
	var closedConfCount =0;
	var allConfCount=0;
	
	var closedChangeCount=0;
	var ChangeCount=0;
	
	var it = response.getWorkItems(); 
	
	
	while(it.hasNext()){
		var wi = it.next();
		var documentId = wi.getField("ID").getValue();   
		var processArea = wi.getField("Process area").getValue();   
		var issueState = wi.getField("State").getValue(); 
		var IssueDeltaBean  = server.getIssueDeltaBean( documentId );  
		var qaState = IssueDeltaBean.getState();
		log("qaState = IssueDeltaBean.getState();"+qaState)
		if(processArea!="SUP.8 Configuration management" ){
			allNoConfCount++;
		}else if(processArea!="SUP.8 Configuration management" && qaState=="Closed"){
			 closedNoConfCount++;
		} 
		if(processArea=="SUP.8 Configuration management" ){
			allConfCount++; 
		}else if(processArea=="SUP.8 Configuration management" && qaState=="Closed"){
			closedConfCount++;
		} 
		if(processArea=="SUP.10 Change request management" ){
			ChangeCount++;
		}else if(processArea=="SUP.10 Change request management" && qaState=="Closed"){
			 closedChangeCount++;
		}
		
		
		
	} 
		var results = [];
		results[0] = closedNoConfCount;
		results[1] = allNoConfCount;
		results[2] = closedConfCount;
		results[3] = allConfCount;
		results[4] = closedChangeCount;
		results[5] = ChangeCount;

		return results;
}
function findByTestCaseQuery(project,type,category){
	//定义容器
	var mv = new Packages.com.mks.api.MultiValue();
	mv.setSeparator(",");
	
	//添加字段
	
	mv.add("ID");
	

	//获取Project字段value值
	var projectVal = project;

	//查询定义

	var queryDefinition="((field[Project]="+projectVal+")  and  (field[Type]= "+type+") and (field[Category]="+category+"))";
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

	//执行cmd
	var response = sessionBean.executeCmd(cmd);

	var it = response.getWorkItems();
	
	
	//Test Objective中所有的测试用例
	var TOIntegrationTotalCount = 0;
	
	var cateList = new java.util.ArrayList();
		
	while(it.hasNext()){
		
		var wi = it.next();
		var documentId = wi.getField("ID").getValue();  
		if(documentId != null || !documentId ){
			TOIntegrationTotalCount++;
			cateList.add(documentId);
		}
	}
	
	var TOIntegrationCount = findByResutlts(cateList);  
	if(!TOIntegrationCount || TOIntegrationCount ==null ||  TOIntegrationCount == undefined){
		TOIntegrationCount==0;
	}
	//log("TOIntegrationCount:--"+TOIntegrationCount) 
	//log("TOIntegrationTotalCount:--"+TOIntegrationTotalCount);
	var  results = []; 
	results[0]=TOIntegrationCount; 
	results[1]=TOIntegrationTotalCount;  
	
	var defectResults = findByDefects(cateList);

	//log("defectResults[0]:--"+defectResults[0]) 
	//log("defectResults[1]:--"+defectResults[1]);
	
	results[3] = defectResults;
	
	
	
	return results;
	
	
}

function findByDefects(list){

	var Count = 0; 
	var DefectTotalCount = 0; 
	if(list == null || list.size() == 0 ||!list){ 
	}

	if(list.size()>0){
		
		for(var i=0;i<list.size();i++){
			var IssueDeltaBean  = server.getIssueDeltaBean( list.get(i) ); 
			var DefectBeans  = IssueDeltaBean.getNewRelatedIssues("Blocked By");
				//log("DefectBeans.length:-- "+ DefectBeans.length);
				DefectTotalCount+=DefectBeans.length;
				if(DefectBeans.length>=1){  
				
					for(var j=0;j<DefectBeans.length;j++){
						
						var deBeans = server.getIssueBean(DefectBeans[j]);
						
							var defectState = deBeans.getState(); 
							//log("defectState:-- "+ defectState)
							if(defectState=="Closed"){
								Count++;
							}

						
					}
				}
		} 
	}
	var  results = []; 
	results[0]=Count; 
	results[1]=DefectTotalCount;   
	
	return results;

}
function findByResutlts(list){
	//Test Objective中有测试结果的系统集成测试用例
	var TOIntegrationCount = 0; 
	if(list == null || list.size() == 0)
	return; 
	if(list.size()>0){
		for(var i=0;i<list.size();i++){
			var IssueDeltaBean  = server.getIssueDeltaBean( list.get(i) ); 
			var testResultBean  = IssueDeltaBean.getTestCaseAssociatedTestResultBeans();  
				if(testResultBean && testResultBean.length >=1 ){  
					TOIntegrationCount++;
					
					for(var j=0;j<testResultBean.length;j++){
						var verdict =testResultBean[j].getVerdict();
						log("verdict:--"+verdict);
						if(verdict!=null || !verdict){
							
						}	
					}
				} 
			//log("ID:--"+list.get(i));	
		} 
	} 
		//log("有结果的数量:--"+TOIntegrationCount);
	
	return TOIntegrationCount;
	

}



function findByCountQuery(project,documentType){
		
	//log("Start findByQuery");
	
	//定义容器
	var mv = new Packages.com.mks.api.MultiValue();
	mv.setSeparator(",");
	
	//添加字段
	
	mv.add("ID");
	

	//获取Project字段value值
	var projectVal = project;

	//查询定义
	
	var queryDefinition="((field[Project]="+projectVal+") and (field[Type]= "+documentType+"))";
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

	//执行cmd
	var response = sessionBean.executeCmd(cmd);

	var it = response.getWorkItems();
	var TotalCount = 0;
	while(it.hasNext()){
		TotalCount++;
		var wi = it.next();
		var documentId = wi.getField("ID").getValue(); 
	}
	return TotalCount;
}

log("------------------------- GW_ProjectFieldAutomatic Calaculatio start ------------------------");
main();
log("------------------------- GW_ProjectFieldAutomatic Calaculatio  end  -------------------------");

