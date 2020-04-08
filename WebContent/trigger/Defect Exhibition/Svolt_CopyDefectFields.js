// <b>Document In Review to Audit State Change Check</b>
// <p>
// MKS ALM 2009 solution
// <p>
// When the Document is rejected to fall back to the previous state, 
// check if the Comment field is filled. If not, throw a prompt
// <p>
// This trigger is a pre-trigger.
// <p>
// <p>
// Author : Hao Cai.
// Create Date : 2018-12-09
// </p>
//
// @param String passwd

///START
eb = bsf.lookupBean("siEnvironmentBean");//环境变量
eb.setMessageCategory("SVOLT");//设置日志分类
log("----- eb = " +  eb);
sb = bsf.lookupBean("imServerBean");//全部服务对象
log("----- sb = " +  sb);
var params = bsf.lookupBean("parametersBean");
var project = params.getParameter("Project");
log("Project = " + project);
delta = bsf.lookupBean("imIssueDeltaBean");//触发对象
 
log("----- delta = " +  delta.getID());
log("----- oldState =" + delta.getOldState());
log("----- newState =" + delta.getNewState());
//对象属性
var typeData = {
	//"Summary" : "",
	"Description" : "",
	"Assigned User" : "",
	"Assigned Group" : "",
	"Priority" : "",
	"Defect Classification" : "",
	"Effort" : "",
	"Estimated Effort" : "",
	
	//"Actual Effort" : "",
	"Found In Sample Phase" : "",
	"Fixed In Sample Phase" : "",
	"Root Cause" : "",
	"Solution" : "",
	//"Comment" : "",
	"Project" : "",
	//"Attachments" : "",
	"Severity" : "",
	"Origin" : "",
	"Defect Source" : "",
	"ASW Version" : "",
	"BSW Version" : "",
	"Calibration Version" : "",
	"SW Component" : "",
	"Found in component revision" : "",
	"Fixed in component revision" : "",
	"Responsibility Team" : "",
     
	"Related Safety":"",
	"Customer ID":"",
	"Sample Phase":"",
	//"Type":"",
	"Actual finish date":"",
	"Defect Level":"",
	//"Changeed Calibration Paramenters":"",
	"Notice Exhibition":"",
	"Notice Users":[],
	"Delay Notice Date":"",
}

var typeOldData = {
		//"Summary" : "",
		"Description" : "",
		"Assigned User" : "",
		"Assigned Group" : "",
		"Priority" : "",
		"Defect Classification" : "",
		"Effort" : "",
		"Estimated Effort" : "",
		
		//"Actual Effort" : "",
		"Found In Sample Phase" : "",
		"Fixed In Sample Phase" : "",
		"Root Cause" : "",
		"Solution" : "",
		//"Comment" : "",
		"Project" : "",
		//"Attachments" : "",
		"Severity" : "",
		"Origin" : "",
		"Defect Source" : "",
		"ASW Version" : "",
		"BSW Version" : "",
		"Calibration Version" : "",
		"SW Component" : "",
		"Found in component revision" : "",
		"Fixed in component revision" : "",
		"Responsibility Team" : "",
	     
		"Related Safety":"",
		"Customer ID":"",
		"Sample Phase":"",
		//"Type":"",
		"Actual finish date":"",
		"Defect Level":"",
		//"Changeed Calibration Paramenters":"",
		"Notice Exhibition":"",
		"Notice Users":[],
		"Delay Notice Date":"",
	}

//主方法
copyFields();

 // 打印信息
function log(s){
    eb.print(s);
}

function copyFields(){
	log("----------------------------------------------------");
	
	//先获取defect对象属性
	//typeData["Summary"] = delta.getNewFieldValue("Summary") == null ? "" : delta.getNewFieldValue("Summary");
	typeData["Description"] = delta.getNewFieldValue("Description") == null ? "" : delta.getNewFieldValue("Description");
	typeData["Assigned User"] = delta.getNewFieldValue("Assigned User") == null ? "" : delta.getNewFieldValue("Assigned User");
	typeData["Assigned Group"] = delta.getNewFieldValue("Assigned Group") == null ? "" : delta.getNewFieldValue("Assigned Group");
	typeData["Priority"] = delta.getNewFieldValue("Priority") == null ? "" : delta.getNewFieldValue("Priority");
	typeData["Defect Classification"] = delta.getNewFieldValue("Defect Classification") == null ? "" : delta.getNewFieldValue("Defect Classification");
	typeData["Effort"] = delta.getNewFieldValue("Effort") == null ? "" : delta.getNewFieldValue("Effort");
	typeData["Estimated Effort"] = delta.getNewFieldValue("Estimated Effort") == null ? "" : delta.getNewFieldValue("Estimated Effort");
 
	//typeData["Actual Effort"] = delta.getNewFieldValue("Actual Effort") == null ? "" : delta.getNewFieldValue("Actual Effort");
	typeData["Found In Sample Phase"] = delta.getNewFieldValue("Found In Sample Phase");
	typeData["Fixed In Sample Phase"] = delta.getNewFieldValue("Fixed In Sample Phase") == null ? "" : delta.getNewFieldValue("Fixed In Sample Phase");
	typeData["Root Cause"] = delta.getNewFieldValue("Root Cause") == null ? "" : delta.getNewFieldValue("Root Cause");
	typeData["Solution"] = delta.getNewFieldValue("Solution") == null ? "" : delta.getNewFieldValue("Solution");
	//typeData["Comment"] = delta.getNewFieldValue("Comment") == null ? "" : delta.getNewFieldValue("Comment");
	typeData["Project"] = delta.getProject();
	//typeData["Attachments"] = delta.getNewFieldValue("Attachments") == null ? "" : delta.getNewFieldValue("Attachments");
	typeData["Severity"] = delta.getNewFieldValue("Severity") == null ? "" : delta.getNewFieldValue("Severity");
	//eb.abortScript("Severity:"+typeData["Severity"] ,true);  
	typeData["Origin"] = delta.getNewFieldValue("Origin") == null ? "" : delta.getNewFieldValue("Origin");
	typeData["Defect Source"] = delta.getNewFieldValue("Defect Source") == null ? "" : delta.getNewFieldValue("Defect Source");
	typeData["ASW Version"] = delta.getNewFieldValue("ASW Version") == null ? "" : delta.getNewFieldValue("ASW Version");
	typeData["BSW Version"] = delta.getNewFieldValue("BSW Version") == null ? "" : delta.getNewFieldValue("BSW Version");
	typeData["Calibration Version"] = delta.getNewFieldValue("Calibration Version") == null ? "" : delta.getNewFieldValue("Calibration Version");
	typeData["SW Component"] = delta.getNewFieldValue("SW Component") == null ? "" : delta.getNewFieldValue("SW Component");
	typeData["Found in component revision"] = delta.getNewFieldValue("Found in component revision") == null ? "" : delta.getNewFieldValue("Found in component revision");
	typeData["Fixed in component revision"] = delta.getNewFieldValue("Fixed in component revision") == null ? "" : delta.getNewFieldValue("Fixed in component revision");
	typeData["Responsibility Team"] = delta.getNewFieldValue("Responsibility Team") == null ? "" : delta.getNewFieldValue("Responsibility Team");
	
	typeData["Related Safety"] = delta.getNewFieldValue("Related Safety") == null ? "" : delta.getNewFieldValue("Related Safety");
	typeData["Customer ID"] = delta.getNewFieldValue("Customer ID") == null ? "" : delta.getNewFieldValue("Customer ID"); 
	typeData["Sample Phase"] = delta.getNewFieldValue("Sample Phase") == null ? "" : delta.getNewFieldValue("Sample Phase");
	//typeData["Type"] = delta.getNewFieldValue("Type") == null ? "" : delta.getNewFieldValue("Type");
	
	
	typeData["Actual finish date"] = delta.getNewFieldValue("Actual finish date") == null ? "" : delta.getNewFieldValue("Actual finish date");
	typeData["Defect Level"] = delta.getNewFieldValue("Defect Level") == null ? "" : delta.getNewFieldValue("Defect Level");
	//typeData["Changeed Calibration Paramenters"] = delta.getNewFieldValue("Changeed Calibration Paramenters") == null ? "" : delta.getNewFieldValue("Changeed Calibration Paramenters");
	typeData["Notice Users"] = delta.getNewFieldValue("Notice Users");
	typeData["Delay Notice Date"] = delta.getNewFieldValue("Delay Notice Date"); 
	// old 
	//typeOldData["Summary"] = delta.getOldFieldValue("Summary") == null ? "" : delta.getOldFieldValue("Summary");
	typeOldData["Description"] = delta.getOldFieldValue("Description") == null ? "" : delta.getOldFieldValue("Description");
	typeOldData["Assigned User"] = delta.getOldFieldValue("Assigned User") == null ? "" : delta.getOldFieldValue("Assigned User");
	typeOldData["Assigned Group"] = delta.getOldFieldValue("Assigned Group") == null ? "" : delta.getOldFieldValue("Assigned Group");
	typeOldData["Priority"] = delta.getOldFieldValue("Priority") == null ? "" : delta.getOldFieldValue("Priority");
	typeOldData["Defect Classification"] = delta.getOldFieldValue("Defect Classification") == null ? "" : delta.getOldFieldValue("Defect Classification");
	typeOldData["Effort"] = delta.getOldFieldValue("Effort") == null ? "" : delta.getOldFieldValue("Effort");
	typeOldData["Estimated Effort"] = delta.getOldFieldValue("Estimated Effort") == null ? "" : delta.getOldFieldValue("Estimated Effort");
 
	//typeOldData["Actual Effort"] = delta.getOldFieldValue("Actual Effort") == null ? "" : delta.getOldFieldValue("Actual Effort");
	typeOldData["Fixed In Sample Phase"] = delta.getOldFieldValue("Fixed In Sample Phase") == null ? "" : delta.getOldFieldValue("Fixed In Sample Phase");
	typeOldData["Root Cause"] = delta.getOldFieldValue("Root Cause") == null ? "" : delta.getOldFieldValue("Root Cause");
	typeOldData["Solution"] = delta.getOldFieldValue("Solution") == null ? "" : delta.getOldFieldValue("Solution");
	//typeOldData["Comment"] = delta.getOldFieldValue("Comment") == null ? "" : delta.getOldFieldValue("Comment");
	typeOldData["Project"] = delta.getOldProject();
	//typeOldData["Attachments"] = delta.getOldFieldValue("Attachments") == null ? "" : delta.getOldFieldValue("Attachments");
	typeOldData["Severity"] = delta.getOldFieldValue("Severity") == null ? "" : delta.getOldFieldValue("Severity");
	//eb.abortScript("Severity:"+typeData["Severity"] ,true);  
	typeOldData["Origin"] = delta.getOldFieldValue("Origin") == null ? "" : delta.getOldFieldValue("Origin");
	typeOldData["Defect Source"] = delta.getOldFieldValue("Defect Source") == null ? "" : delta.getOldFieldValue("Defect Source");
	typeOldData["ASW Version"] = delta.getOldFieldValue("ASW Version") == null ? "" : delta.getOldFieldValue("ASW Version");
	typeOldData["BSW Version"] = delta.getOldFieldValue("BSW Version") == null ? "" : delta.getOldFieldValue("BSW Version");
	typeOldData["Calibration Version"] = delta.getOldFieldValue("Calibration Version") == null ? "" : delta.getOldFieldValue("Calibration Version");
	typeOldData["SW Component"] = delta.getOldFieldValue("SW Component") == null ? "" : delta.getOldFieldValue("SW Component");
	typeOldData["Found in component revision"] = delta.getOldFieldValue("Found in component revision") == null ? "" : delta.getOldFieldValue("Found in component revision");
	typeOldData["Fixed in component revision"] = delta.getOldFieldValue("Fixed in component revision") == null ? "" : delta.getOldFieldValue("Fixed in component revision");
	typeOldData["Responsibility Team"] = delta.getOldFieldValue("Responsibility Team") == null ? "" : delta.getOldFieldValue("Responsibility Team");
	
	typeOldData["Related Safety"] = delta.getOldFieldValue("Related Safety") == null ? "" : delta.getOldFieldValue("Related Safety");
	typeOldData["Customer ID"] = delta.getOldFieldValue("Customer ID") == null ? "" : delta.getOldFieldValue("Customer ID"); 
	typeOldData["Sample Phase"] = delta.getOldFieldValue("Sample Phase") == null ? "" : delta.getOldFieldValue("Sample Phase");
	//typeOldData["Type"] = delta.getOldFieldValue("Type") == null ? "" : delta.getOldFieldValue("Type");
	
	
	typeOldData["Actual finish date"] = delta.getOldFieldValue("Actual finish date") == null ? "" : delta.getOldFieldValue("Actual finish date");
	typeOldData["Defect Level"] = delta.getOldFieldValue("Defect Level") == null ? "" : delta.getOldFieldValue("Defect Level");
	//typeOldData["Changeed Calibration Paramenters"] = delta.getOldFieldValue("Changeed Calibration Paramenters") == null ? "" : delta.getNewFieldValue("Changeed Calibration Paramenters");
	typeOldData["Notice Users"] = delta.getOldFieldValue("Notice Users");
	typeOldData["Delay Notice Date"] = delta.getOldFieldValue("Delay Notice Date");
   
	
	//获取关系字段的值
	var hzdxid =  delta.getRelatedIssues("Related Notice Exhibition"); 
	var passwd = params.getParameter("passwd");//触发器参数
	
	var ScriptAPISessionBean = eb.createAPISessionBean("admin",passwd); 
	 
	var cmd	= ScriptAPISessionBean.createAPICommandRunnerBean(); 
	cmd.setCommand("im","editissue");
// 
	for(key in typeData){
		var newValue = typeData[key];
		if(newValue != ""){
			var oldValue = typeOldData[key];
			if(newValue != oldValue){//有更新才设置
				if(key == "Delay Notice Date"){
					var sj =  new  java.lang.String(newValue);
					sj = sj.split(" ");
					sj = sj[1]+" "+sj[2]+", "+sj[5]; 
					cmd.addOption("field",key+"="+ sj); 
				}else if(key == "Notice Users"){
					var pdusers = new  java.lang.String(typeData["Notice Users"]);  
					if(pdusers.split(",").length == 1){ 
						cmd.addOption("field",key+"="+ typeData["Notice Users"]); 
					} else{
						pdusers = pdusers.substring(1,pdusers.length()-1); 
						cmd.addOption("field",key+"="+ pdusers); 
					} 
				}else {
					cmd.addOption("field",key+"="+newValue);
				}
			}
			
		}
	};  
	cmd.addSelectionElement(hzdxid[0]);
	cmd.execute(); 
    //eb.abortScript("------------:"+hzdxid[0] ,true);  
	
}

 