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
// @param String Project

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
	"Summary" : "",
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
	"Comment" : "",
	"Project" : "",
	"Attachments" : "",
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
	"Type":"",
	"Actual finish date":"",
	"Defect Level":"",
	//"Changeed Calibration Paramenters":"",
	"Notice Exhibition":"",
	"Notice Users":[],
	"Delay Notice Date":"",
}

//主方法
documentCommentCheck();

 // 打印信息
function log(s){
    eb.print(s);
}

function documentCommentCheck(){
	log("----------------------------------------------------");
	
	//先获取defect对象属性
	typeData["Summary"] = delta.getFieldValue("Summary") == null ? "" : delta.getFieldValue("Summary");
	typeData["Description"] = delta.getFieldValue("Description") == null ? "" : delta.getFieldValue("Description");
	typeData["Assigned User"] = delta.getFieldValue("Assigned User") == null ? "" : delta.getFieldValue("Assigned User");
	typeData["Assigned Group"] = delta.getFieldValue("Assigned Group") == null ? "" : delta.getFieldValue("Assigned Group");
	typeData["Priority"] = delta.getFieldValue("Priority") == null ? "" : delta.getFieldValue("Priority");
	typeData["Defect Classification"] = delta.getFieldValue("Defect Classification") == null ? "" : delta.getFieldValue("Defect Classification");
	typeData["Effort"] = delta.getFieldValue("Effort") == null ? "" : delta.getFieldValue("Effort");
	typeData["Estimated Effort"] = delta.getFieldValue("Estimated Effort") == null ? "" : delta.getFieldValue("Estimated Effort");
 
	//typeData["Actual Effort"] = delta.getFieldValue("Actual Effort") == null ? "" : delta.getFieldValue("Actual Effort");
	typeData["Found In Sample Phase"] = delta.getFieldValue("Found In Sample Phase");
	typeData["Fixed In Sample Phase"] = delta.getFieldValue("Fixed In Sample Phase") == null ? "" : delta.getFieldValue("Fixed In Sample Phase");
	typeData["Root Cause"] = delta.getFieldValue("Root Cause") == null ? "" : delta.getFieldValue("Root Cause");
	typeData["Solution"] = delta.getFieldValue("Solution") == null ? "" : delta.getFieldValue("Solution");
	typeData["Comment"] = delta.getFieldValue("Comment") == null ? "" : delta.getFieldValue("Comment");
	typeData["Project"] = project;
	//typeData["Attachments"] = delta.getFieldValue("Attachments") == null ? "" : delta.getFieldValue("Attachments");
	typeData["Severity"] = delta.getFieldValue("Severity") == null ? "" : delta.getFieldValue("Severity");
	//eb.abortScript("Severity:"+typeData["Severity"] ,true);  
	typeData["Origin"] = delta.getFieldValue("Origin") == null ? "" : delta.getFieldValue("Origin");
	typeData["Defect Source"] = delta.getFieldValue("Defect Source") == null ? "" : delta.getFieldValue("Defect Source");
	typeData["ASW Version"] = delta.getFieldValue("ASW Version") == null ? "" : delta.getFieldValue("ASW Version");
	typeData["BSW Version"] = delta.getFieldValue("BSW Version") == null ? "" : delta.getFieldValue("BSW Version");
	typeData["Calibration Version"] = delta.getFieldValue("Calibration Version") == null ? "" : delta.getFieldValue("Calibration Version");
	typeData["SW Component"] = delta.getFieldValue("SW Component") == null ? "" : delta.getFieldValue("SW Component");
	typeData["Found in component revision"] = delta.getFieldValue("Found in component revision") == null ? "" : delta.getFieldValue("Found in component revision");
	typeData["Fixed in component revision"] = delta.getFieldValue("Fixed in component revision") == null ? "" : delta.getFieldValue("Fixed in component revision");
	typeData["Responsibility Team"] = delta.getFieldValue("Responsibility Team") == null ? "" : delta.getFieldValue("Responsibility Team");
	
	typeData["Related Safety"] = delta.getFieldValue("Related Safety") == null ? "" : delta.getFieldValue("Related Safety");
	typeData["Customer ID"] = delta.getFieldValue("Customer ID") == null ? "" : delta.getFieldValue("Customer ID"); 
	typeData["Sample Phase"] = delta.getFieldValue("Sample Phase") == null ? "" : delta.getFieldValue("Sample Phase");
	typeData["Type"] = delta.getFieldValue("Type") == null ? "" : delta.getFieldValue("Type");
	
	
	typeData["Actual finish date"] = delta.getFieldValue("Actual finish date") == null ? "" : delta.getFieldValue("Actual finish date");
	typeData["Defect Level"] = delta.getFieldValue("Defect Level") == null ? "" : delta.getFieldValue("Defect Level");
	//typeData["Changeed Calibration Paramenters"] = delta.getFieldValue("Changeed Calibration Paramenters") == null ? "" : delta.getFieldValue("Changeed Calibration Paramenters");
	typeData["Notice Users"] = delta.getNewFieldValue("Notice Users");  

	var d = new Date(delta.getNewFieldValue("Delay Notice Date"));
	var sjstr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	var date = sjstr.replace(/-/g,'/'); 
	typeData["Delay Notice Date"] = new Date(date).getTime();  
	
    
	
	//在创建横展对象 赋值
	var DefectNoticeExhibition = sb.postNewIssue("Defect Notice Exhibition");
	//基础属性(必填)
	DefectNoticeExhibition.setSummary(typeData["Summary"]+"004");
	DefectNoticeExhibition.setProject(typeData["Project"]);
	
	DefectNoticeExhibition.setAssignedUser(typeData["Assigned User"]);
	DefectNoticeExhibition.setState("Analyzed"); 
	DefectNoticeExhibition.setFieldValue("Defect Source",typeData["Defect Source"]); 
	
	var pdusers = new  java.lang.String(typeData["Notice Users"]);  
	//eb.abortScript("Notice Users:"+ pdusers.split(",").length,true); 
	if(pdusers.split(",").length == 1){ 
		var newUser = new  java.util.HashSet();
		if(pduserss.indexOf("[")>-1){//用户有时候带[]有时候不带
			pdusers = pdusers.substring(1,pdusers.length()-1); 
		}
		newUser.add(pdusers);  
		DefectNoticeExhibition.setSetFieldValue("Notice Users",newUser);  
	} else{
		DefectNoticeExhibition.setSetFieldValue("Notice Users",typeData["Notice Users"]); 
	}
	
	DefectNoticeExhibition.setFieldValue("Delay Notice Date", typeData["Delay Notice Date"]);
	//DefectNoticeExhibition.setAssignedGroup(typeData["Assigned Group"]);
	
	if(typeData["Description"]!=""){
		DefectNoticeExhibition.setFieldValue("Description",typeData["Description"]);
	}
	if(typeData["Priority"]!=""){
		DefectNoticeExhibition.setFieldValue("Priority",typeData["Priority"]);
	}
	if(typeData["Defect Classification"]!=""){
		DefectNoticeExhibition.setFieldValue("Defect Classification",typeData["Defect Classification"]);
	}
	if(typeData["Effort"]!=""){
		DefectNoticeExhibition.setFieldValue("Effort",typeData["Effort"]);
	}
	if(typeData["Estimated Effort"]!=""){
		DefectNoticeExhibition.setFieldValue("Estimated Effort",typeData["Estimated Effort"]);
	} 
	//计算字段
	//if(typeData["Actual Effort"]!=""){
		//DefectNoticeExhibition.setFieldValue("Actual Effort",typeData["Actual Effort"]);
	//}
	if(typeData["Found In Sample Phase"]!=""){
		DefectNoticeExhibition.setFieldValue("Found In Sample Phase",typeData["Found In Sample Phase"]);
	}
	if(typeData["Fixed In Sample Phase"]!=""){
		DefectNoticeExhibition.setFieldValue("Fixed In Sample Phase",typeData["Fixed In Sample Phase"]);
	}
	if(typeData["Root Cause"]!=""){
		DefectNoticeExhibition.setFieldValue("Root Cause",typeData["Root Cause"]);
	}
	if(typeData["Solution"]!=""){
		DefectNoticeExhibition.setFieldValue("Solution",typeData["Solution"]);
	}
	if(typeData["Severity"]!=""){
		DefectNoticeExhibition.setFieldValue("Severity",typeData["Severity"]);
	}
	if(typeData["Origin"]!=""){
		DefectNoticeExhibition.setFieldValue("Origin",typeData["Origin"]);
	}
	if(typeData["ASW Version"]!=""){
		 DefectNoticeExhibition.setFieldValue("ASW Version",typeData["ASW Version"]);
	}
	if(typeData["BSW Version"]!=""){
		 DefectNoticeExhibition.setFieldValue("BSW Version",typeData["BSW Version"]);
	}
	if(typeData["Calibration Version"]!=""){
		 DefectNoticeExhibition.setFieldValue("Calibration Version",typeData["Calibration Version"]);
	}
	if(typeData["SW Component"]!=""){
		 DefectNoticeExhibition.setFieldValue("SW Component",typeData["SW Component"]);
	}
	if(typeData["Found in component revision"]!=""){
		 DefectNoticeExhibition.setFieldValue("Found in component revision",typeData["Found in component revision"]);
	}
	if(typeData["Fixed in component revision"]!=""){
		 DefectNoticeExhibition.setFieldValue("Fixed in component revision",typeData["Fixed in component revision"]);
	}
	if(typeData["Responsibility Team"]!=""){
		 DefectNoticeExhibition.setFieldValue("Responsibility Team",typeData["Responsibility Team"]);
	} 
	if(typeData["Related Safety"]!=""){
		  DefectNoticeExhibition.setFieldValue("Related Safety",typeData["Related Safety"]);
	}   
	if(typeData["Customer ID"]!=""){
		  DefectNoticeExhibition.setFieldValue("Customer ID",typeData["Customer ID"]);
	}
	if(typeData["Sample Phase"]!=""){
		  DefectNoticeExhibition.setFieldValue("Sample Phase",typeData["Sample Phase"]);
	}
	//试图修改只读字段“Type
	//if(typeData["Type"]!=""){
		 // DefectNoticeExhibition.setFieldValue("Type",typeData["Type"]);
	//}
	if(typeData["Actual finish date"]!=""){
		var d1 = new Date(typeData["Actual finish date"]);
		//var sjstr1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();
		var date1 = sjstr1.replace(/-/g,'/'); 
		//typeData["Actual finish date"] = new Date(date1).getTime(); 
		DefectNoticeExhibition.setFieldValue("Actual finish date",new Date(date1).getTime());
	}
	if(typeData["Defect Level"]!=""){
		  DefectNoticeExhibition.setFieldValue("Defect Level",typeData["Defect Level"]);
	}
	//客户电脑没有这个字段
	//if(typeData["Changeed Calibration Paramenters"]!=""){
		  //DefectNoticeExhibition.setFieldValue("Changeed Calibration Paramenters",typeData["Changeed Calibration Paramenters"]);
	//}
	 
	log("id--------------------------" + delta.	getID());
	
	 //关系字段
	delta.addRelatedIssue("Related Notice Exhibition",[DefectNoticeExhibition.getID()]);
	
	 
	
    //eb.abortScript("Attachments:"+typeData["Attachments"] ,true);  
	
}
