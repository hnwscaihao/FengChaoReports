//
// <b>Integrity Manager POST-Event Trigger00099</b>
// <p>
// @param String Subject
//
// @param String Title
//
// @param String Note Info
// Print the message, we use it to trace the trigger info
importPackage(Packages.javax.activation);

function abort(s){
    eb.abortScript(s, true);
}
function log(s){
    Packages.mks.util.Logger.message(s);
}
var eb = bsf.lookupBean("siEnvironmentBean");

// Lookup the parameters bean, and from it find our three parameters, the recipient, the subject, and the message start.
var params = bsf.lookupBean("parametersBean");
var mksHost = eb.getServerConfigurationProperty("mksis.logging.syslog.hostname");
// Find the server bean, this allows us to lookup an arbitrary issue
var server = bsf.lookupBean("imServerBean");
var delta = bsf.lookupBean("imIssueDeltaBean");
var serverHost="integrity:"+eb.getHostURL().substring(5);
var params = bsf.lookupBean("parametersBean");
var subject = params.getParameter("Subject");

var title = params.getParameter("Title");		
var hostPort = eb.getMailHostnameAndPort();

var host = hostPort[0];

var smtpPort = hostPort[1];

if (host == null || host.length() == 0){
       abort("host is null!");
}   

// default to 25
if ( smtpPort == null || smtpPort.length() == 0 ) {
       smtpPort = "25";
}
var createUser;																
var hostUrl = eb.getHostURL();
var mksHost = eb.getHostname();
var mksPort = eb.getHostPort();

var assignUser = delta.getNewAssignedUser();
var receiveIds = new java.util.ArrayList();//装app推送接受人的集合 logid

function printParams(){
       log("----subject="+subject);
       log("----fromAddr="+fromAddr);
       log("----host="+host);
       log("----smtpPort="+smtpPort);
       log("----hostUrl="+hostUrl);
       log("----mksHost="+mksHost);
       log("----mksPort="+mksPort);
	   log("----assignUser="+assignUser);
}
importPackage(Packages.javax.mail);
importPackage(Packages.org.apache.commons.mail);
importPackage(Packages.javax.activation);
importPackage(Packages.javax.mail.internet);
/**
*
* Periodically check the dynamic groups of all items

*/
function main(){
		// new java.lang.String();
	var projectName = delta.getProject();

	var projectId = delta.getID();
	if (projectId == "0" || projectId == 0) {
		eb
				.abortScript(
						" You cannot edit the Project Access Members and Project Access Groups fields when creating a Project ",
						true);
		return;
	}
	if (projectId == null || projectId == "") {
		eb
				.abortScript(
						" You cannot edit the Project Access Members and Project Access Groups fields when creating a Project ",
						true);
		return;
	}
	if (null == projectName || "" == projectName) {
		eb
				.abortScript(
						" You cannot edit the Project Access Members and Project Access Groups fields when creating a Project ",
						true);
		return;
	}
	var newList = new java.util.ArrayList();
	var oldList = new java.util.ArrayList();
	var dynamicgroupNames = new java.util.ArrayList();
	// 首先获取所有代表动态组的字段的新旧值
	var NewASWEngineerDG = delta.getNewFieldValue("ASW Engineer DG");
	var OldASWEngineerDG = delta.getOldFieldValue("ASW Engineer DG");
	newList.add(NewASWEngineerDG);
	oldList.add(OldASWEngineerDG);
	dynamicgroupNames.add("ASW Engineer DG");

	var NewASWLeaderDG = delta.getNewFieldValue("ASW Leader DG");
	var OldASWLeaderDG = delta.getOldFieldValue("ASW Leader DG");
	newList.add(NewASWLeaderDG);
	oldList.add(OldASWLeaderDG);
	dynamicgroupNames.add("ASW Leader DG");

	var NewBSWEngineerDG = delta.getNewFieldValue("BSW Engineer DG");
	var OldBSWEngineerDG = delta.getOldFieldValue("BSW Engineer DG");
	newList.add(NewBSWEngineerDG);
	oldList.add(OldBSWEngineerDG);
	dynamicgroupNames.add("BSW Engineer DG");

	var NewBSWLeaderDG = delta.getNewFieldValue("BSW Leader DG");
	var OldBSWLeaderDG = delta.getOldFieldValue("BSW Leader DG");
	newList.add(NewBSWLeaderDG);
	oldList.add(OldBSWLeaderDG);
	dynamicgroupNames.add("BSW Leader DG");

	var NewCCBDG = delta.getNewFieldValue("CCB DG");
	var OldCCBDG = delta.getOldFieldValue("CCB DG");
	newList.add(NewCCBDG);
	oldList.add(OldCCBDG);
	dynamicgroupNames.add("CCB DG");

	var NewCCBLeaderDG = delta.getNewFieldValue("CCB Leader DG");
	var OldCCBLeaderDG = delta.getOldFieldValue("CCB Leader DG");
	newList.add(NewCCBLeaderDG);
	oldList.add(OldCCBLeaderDG);
	dynamicgroupNames.add("CCB Leader DG");

	var NewConfigurationManagerDG = delta
			.getNewFieldValue("Configuration Manager DG");
	var OldConfigurationManagerDG = delta
			.getOldFieldValue("Configuration Manager DG");
	newList.add(NewConfigurationManagerDG);
	oldList.add(OldConfigurationManagerDG);
	dynamicgroupNames.add("Configuration Manager DG");

	var NewDirectorDG = delta.getNewFieldValue("Director DG");
	var OldDirectorDG = delta.getOldFieldValue("Director DG");
	newList.add(NewDirectorDG);
	oldList.add(OldDirectorDG);
	dynamicgroupNames.add("Director DG");

	var NewFunctionalSafetyEngineerDG = delta
			.getNewFieldValue("Functional Safety Engineer DG");
	var OldFunctionalSafetyEngineerDG = delta
			.getOldFieldValue("Functional Safety Engineer DG");
	newList.add(NewFunctionalSafetyEngineerDG);
	oldList.add(OldFunctionalSafetyEngineerDG);
	dynamicgroupNames.add("Functional Safety Engineer DG");

	var NewFunctionalSafetyLeaderDG = delta
			.getNewFieldValue("Functional Safety Leader DG");
	var OldFunctionalSafetyLeaderDG = delta
			.getOldFieldValue("Functional Safety Leader DG");
	newList.add(NewFunctionalSafetyLeaderDG);
	oldList.add(OldFunctionalSafetyLeaderDG);
	dynamicgroupNames.add("Functional Safety Leader DG");

	var NewHardwareEngineerDG = delta.getNewFieldValue("Hardware Engineer DG");
	var OldHardwareEngineerDG = delta.getOldFieldValue("Hardware Engineer DG");
	newList.add(NewHardwareEngineerDG);
	oldList.add(OldHardwareEngineerDG);
	dynamicgroupNames.add("Hardware Engineer DG");

	var NewHardwareEnginnerLeaderDG = delta
			.getNewFieldValue("Hardware Enginner Leader DG");
	var OldHardwareEnginnerLeaderDG = delta
			.getOldFieldValue("Hardware Enginner Leader DG");
	newList.add(NewHardwareEnginnerLeaderDG);
	oldList.add(OldHardwareEnginnerLeaderDG);
	dynamicgroupNames.add("Hardware Enginner Leader DG");

	var NewPRCDG = delta.getNewFieldValue("PRC DG");
	var OldPRCDG = delta.getOldFieldValue("PRC DG");
	newList.add(NewPRCDG);
	oldList.add(OldPRCDG);
	dynamicgroupNames.add("PRC DG");

	var NewPRCGroupLeaderDG = delta.getNewFieldValue("PRC Group Leader DG");
	var OldPRCGroupLeaderDG = delta.getOldFieldValue("PRC Group Leader DG");
	newList.add(NewPRCGroupLeaderDG);
	oldList.add(OldPRCGroupLeaderDG);
	dynamicgroupNames.add("PRC Group Leader DG");

	var NewProjectManagerDG = delta.getNewFieldValue("Project Manager DG");
	var OldProjectManagerDG = delta.getOldFieldValue("Project Manager DG");
	newList.add(NewProjectManagerDG);
	oldList.add(OldProjectManagerDG);
	dynamicgroupNames.add("Project Manager DG");

	var NewQADG = delta.getNewFieldValue("QA DG");
	var OldQADG = delta.getOldFieldValue("QA DG");
	newList.add(NewQADG);
	oldList.add(OldQADG);
	dynamicgroupNames.add("QA DG");

	var NewReviewCommitteeDG = delta.getNewFieldValue("Review Committee DG");
	var OldReviewCommitteeDG = delta.getOldFieldValue("Review Committee DG");
	newList.add(NewReviewCommitteeDG);
	oldList.add(OldReviewCommitteeDG);
	dynamicgroupNames.add("Review Committee DG");

	var NewReviewCommitteeLeaderDG = delta
			.getNewFieldValue("Review Committee Leader DG");
	var OldReviewCommitteeLeaderDG = delta
			.getOldFieldValue("Review Committee Leader DG");
	newList.add(NewReviewCommitteeLeaderDG);
	oldList.add(OldReviewCommitteeLeaderDG);
	dynamicgroupNames.add("Review Committee Leader DG");

	var NewSystemEngineerDG = delta.getNewFieldValue("System Engineer DG");
	var OldSystemEngineerDG = delta.getOldFieldValue("System Engineer DG");
	newList.add(NewSystemEngineerDG);
	oldList.add(OldSystemEngineerDG);
	dynamicgroupNames.add("System Engineer DG");

	var NewSystemLeadersDG = delta.getNewFieldValue("System Leaders DG");
	var OldSystemLeadersDG = delta.getOldFieldValue("System Leaders DG");
	newList.add(NewSystemLeadersDG);
	oldList.add(OldSystemLeadersDG);
	dynamicgroupNames.add("System Leaders DG");

	var NewTestEngineerDG = delta.getNewFieldValue("Test Engineer DG");
	var OldTestEngineerDG = delta.getOldFieldValue("Test Engineer DG");
	newList.add(NewTestEngineerDG);
	oldList.add(OldTestEngineerDG);
	dynamicgroupNames.add("Test Engineer DG");

	var NewTestLeaderDG = delta.getNewFieldValue("Test Leader DG");
	var OldTestLeaderDG = delta.getOldFieldValue("Test Leader DG");
	newList.add(NewTestLeaderDG);
	oldList.add(OldTestLeaderDG);
	dynamicgroupNames.add("Test Leader DG");

	log("newList size() : " + newList.size());
	for (var i = 0; i < newList.size(); i++) {
		var currentNewList = newList.get(i);
		var currentOldList = oldList.get(i);
		var dynamicgroupName = dynamicgroupNames.get(i);
		log("dynamicgroupName : " + dynamicgroupName);
		log("New value : " + currentNewList);
		log("Old value : " + currentOldList);
		var isUpdate = false;

		var newStr = null;
		var oldStr = null;
		if (currentNewList != null) {
			var currentNewListString = currentNewList + "";
			var leftIndex = currentNewListString.indexOf("[");
			var rightIndex = currentNewListString.indexOf("]");
			if (rightIndex > -1 && leftIndex > -1) {
				newStr = currentNewListString.substring(leftIndex + 1,
						rightIndex);
			} else {
				newStr = currentNewListString;
			}
		}
		if (currentOldList != null) {
			var currentOldListString = currentOldList + "";
			var leftIndex = currentOldListString.indexOf("[");
			var rightIndex = currentOldListString.indexOf("]");
			if (rightIndex > -1 && leftIndex > -1) {
				oldStr = currentOldListString.substring(leftIndex + 1,
						rightIndex);
			} else {
				oldStr = currentOldListString;
			}
		}

		if (newStr == oldStr) {
			log("equals");
			isUpdate = false;
		} else {
			log("different");
			isUpdate = true;

		}
		if (isUpdate) {

			var membershipStr = "";
			if (null != currentNewList && "" != currentNewList) {
				var currentNewStr = "" + currentNewList;
				log("currentNewStr  = " + currentNewStr);
				var currentNewArray = currentNewStr.split(",");
				log("currentNewArray  = " + currentNewArray);

				var newMembers = "";

				if (currentNewArray.length > 1) {
					newMembers = currentNewStr.substring(1,
							currentNewStr.length - 1);
				} else {
					log("left index : " + currentNewStr.indexOf("["));
					log("right index : " + currentNewStr.indexOf("]"));
					log("currentNewStr.length : " + currentNewStr.length);
					if (currentNewStr.indexOf("]") > 0
							&& currentNewStr.indexOf("[") == 0) {
						newMembers = currentNewStr.substring(1,
								currentNewStr.length - 1);
					} else {
						newMembers = currentNewStr;
					}

				}

				log("newMembers : " + newMembers);
				var users = trim(newMembers);
				var userJoint = users.join(",");
				log("userJoint : " + userJoint);

				membershipStr = projectName + "=u=" + userJoint;

			}

			if (membershipStr == "") {
				membershipStr = projectName + "=nomembers";

			}
			log("membershipStr  = " + membershipStr);
			var sessionBean = eb.createAPISessionBean();
			var cmd = new Packages.com.mks.api.Command("im", "editdynamicgroup");
			cmd.addOption(new Packages.com.mks.api.Option("projectmembership",
					membershipStr));
			cmd.addOption(new Packages.com.mks.api.Option("hostname",
					"192.168.10.128"));
			cmd.addOption(new Packages.com.mks.api.Option("user", "admin"));
			cmd.addOption(new Packages.com.mks.api.Option("password", "admin"));
			cmd.addSelection(dynamicgroupName);
			log("Start Cmd");
			var response = sessionBean.executeCmd(cmd);
		}
	}

	// 首先获得超级管理员人员 然后进行邮件通知
	var assignedUserBean = server.getUserBean("admin");
	var userFullName = assignedUserBean.getFullName();
	log("userFullName : " + userFullName);
	if (null == userFullName || "" == userFullName) {
		userFullName = assignedUserBean.getName();
	}
	log("userFullName : " + userFullName);
	var toAddr = assignedUserBean.getEmailAddress();
	// var toAddr = "876523329@qq.com"
	if (null != toAddr && "" != toAddr && "null" != toAddr) {
		var body = createHTMLBody(delta, userFullName);
		var titleDis = "(\u6d4b\u8bd5)";
		log("ebgetHostURL  :" + eb.getHostURL());
		if (eb.getHostURL().indexOf("integrity") > -1) {
			titleDis = "";
		}
		// 最后调用 sendMailToUser() 进行邮件发送。
		sendMailToUser(toAddr, subject, body, userFullName, titleDis);

		try {
			dingMessage(receiveIds, userFullName);
		} catch (e) {
			log("Connect DingDing error");
		}
	}
}

function trim(Str){
	var ArrayList = Str.split(",");
	log( "ArrayList : " + ArrayList);
	log( "ArrayList length : " + ArrayList.length );
	var userList = new Array();
	var userIndex = 0;
	for( var i=0 ; i<ArrayList.length; i++ ){
		var currentUser = ArrayList[i];
		var index = currentUser.indexOf(" ");
		if( index!=-1 ){
			var newUser = currentUser.replace(" ","");
			userList[userIndex] = newUser;
			userIndex++;
		}else{
			userList[userIndex] = currentUser;
			userIndex++;
		}
	}
	return userList;
}

function sendMailToUser(userArr,currSubject, html,user,titleDis){
    // 这里是SMTP发送服务器的名字：163的如下："smtp.163.com"  
	var email = new HtmlEmail();
	email.setHostName(host);
	// 字符编码集的设置  
	email.setCharset("UTF-8");
	// 发送人的邮箱  
	email.setFrom("caihaohnws@163.com", "ALM");  
	// 如果需要认证信息的话，设置认证：用户名-密码。分别为发件人在邮件服务器上的注册名称和密码  //服务器只能保存用户名，不能保存密码
	email.setAuthentication("caihaohnws@163.com", "829728aini");
	// 设置收件人信息
	log("userArr" + userArr);
	
	email.addTo(userArr);
	// 设置抄送人信息
	//setCc(email, mail);
	// 设置密送人信息
	//setBcc(email, mail);
	// 要发送的邮件主题  
	email.setSubject(currSubject);
	
	
	// 要发送的信息，由于使用了HtmlEmail，可以在邮件内容中使用HTML标签  
	email.setHtmlMsg(html);
	
	// 发送  
	email.send();
}

function createHTMLBody(itemObj,user){
	if(itemObj == null){
		return "";
	}

	var itemId = itemObj.getIssueIDString();

	var type = itemObj.getType();

	var summary = itemObj.getNewSummary();    

	summary = (summary == null) ? "" : summary;

	var state = itemObj.getNewState();    

	state = (state == null) ? "" : state;


	log("state:---"+ state + "type :---"+type);

	if("Closed" == state && "Defect" == type ){

		var createUser = itemObj.getCreatedUser();
		createUser = new java.lang.String(createUser);
		if(createUser.indexOf('[') == 0 && createUser.indexOf(']') > 0){
			createUser = createUser.substring(1, createUser.length()-1);
		}
		var userArr = createUser.split(",");
		for(var i = 0 ; i < userArr.length;i++){
			if(userArr[i] == null || userArr[i] == ""){
				continue;
			} 
			receiveIds.add(userArr[i].trim());
			var userBean = server.getUserBean(userArr[i].trim());
			userFullName = userBean.getFullName(); 

			if(userFullName != null && userFullName != ''){
				createUser= userFullName;
			}

			var toAddr = userBean.getEmailAddress();

			if(toAddr != null && toAddr != ""){
				if(toAddr.indexOf(";")>-1){
					toAddr = toAddr.replace(";","");
				}
				log("send email to address : " + toAddr);
				toList.add(toAddr); 
			}
		}

	}else{

		if(assignUser != null && assignUser != ""){

			assignUser = new java.lang.String(assignUser);

			if(assignUser.indexOf('[') == 0 && assignUser.indexOf(']') > 0){
				assignUser = assignUser.substring(1, assignUser.length()-1);
			}

			var userArr = assignUser.split(",");

			for(var i = 0 ; i < userArr.length;i++){
				if(userArr[i] == null || userArr[i] == ""){
					continue;
				}
				receiveIds.add(userArr[i].trim());
				log("userArr: " + userArr[i]);
				var userBean = server.getUserBean(userArr[i].trim());
				var userFullName = userBean.getFullName();
				if(userFullName != null && userFullName != ''){
					assignUser = userFullName;
				}

				var toAddr = userBean.getEmailAddress();

				if(toAddr != null && toAddr != ""){
					if(toAddr.indexOf(";")>-1){
						toAddr = toAddr.replace(";","");
					}
					log("send email to address : " + toAddr);
					toList.add(toAddr); 
				}
			}

		} 
	}


	var project = itemObj.getNewFieldValue("Project"); 

	project = (project == null) ? "" : project;

	var msg = "<html>";

	msg += "<head>";

	msg += "<title>"+title+"</title>";

	msg += "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />";

	msg += "<style type='text/css'>";

	msg += "body {background-color:#FFFFFF; font-family: Verdana,Arial,Helvetica,Tahoma,sans-serif; font-size: 11px; color:#666666;}";

	msg += "</style>";

	msg += "</head>";

	msg += "<body>";

	msg += "<p><span style='font-family: 微软雅黑'><span style='font-size: 10.5pt'>&#x5C0A;&#x656C;&#x7684;"+ user + ",&#x60A8;&#x597D;:</span></span></p>";    

	msg += "<p><span style='font-family: 微软雅黑; font-size: 10.5pt;'>Integrity&#x7CFB;&#x7EDF;&#x4E2D;,&#x9879;&#x76EE;&#x7ECF;&#x7406;&#x5DF2;&#x7ECF;&#x8C03;&#x6574;&#x9879;&#x76EE;&#x6210;&#x5458;&#x914D;&#x7F6E;&#xFF0C;&#x8BF7;&#x60A8;&#x53CA;&#x65F6;&#x5C06;&#x914D;&#x7F6E;&#x53D8;&#x66F4;&#x9879;&#x4ECE;&#x6D4B;&#x8BD5;&#x73AF;&#x5883;&#x63A8;&#x9001;&#x5230;&#x751F;&#x4EA7;&#x73AF;&#x5883;&#xFF01;&#x63A8;&#x9001;&#x65B9;&#x5F0F;&#x8BF7;&#x53C2;&#x7167;:</span></p>";
	msg += "<p><span style='font-family: 微软雅黑; font-size: 10.5pt;'><a href='http://integrity.weichai.com:7001/installs/win32-ia32/Integrity%E9%85%8D%E7%BD%AE%E6%8E%A8%E9%80%81%E6%89%8B%E5%86%8C.pptx'>Integrity\u914d\u7f6e\u63a8\u9001\u624b\u518c</a></span></p>";


	msg += "<table style='width: 405px; border-collapse: collapse; height: 150px; background-color: rgb(192, 192, 192);' bordercolor='#FFFFFF' cellspacing='2' cellpadding='3' border='1'>";

	msg += "<tbody>";

	//ID
	msg += "<tr><td style='height: 17px; width: 78px;'><span style='font-family: 微软雅黑;'>&ensp;ID</span></td>"
		msg += "<td style='height: 17px; width: 314px;'><span style='font-family: 微软雅黑;'><a href="+serverHost+"/im/viewissue?selection="+itemId+">"+itemId+"</a></span></td>"

		//Type Name
		msg += "<tr><td style='height: 17px; width: 78px;'><span style='font-family: 微软雅黑;'>&ensp;&#x7C7B;&#x578B;</span></td>" 
			msg += "<td style='height: 17px; width: 314px;'><span style='font-family: 微软雅黑;'>&nbsp;"+ type +"</span></td>"

			//Summary
			msg += "<tr><td style='height: 17px; width: 78px;'><span style='font-family: 微软雅黑;'>&ensp;&#x63CF;&#x8FF0;</span></td>"
				msg += "<td style='height: 17px; width: 314px;'><span style='font-family: 微软雅黑;'>&nbsp;"+ summary +"</span></td>"

				//State
				msg += "<tr><td style='height: 17px; width: 78px;'><span style='font-family: 微软雅黑;'>&ensp;&#x72B6;&#x6001;</span></td>"
					msg += "<td style='height: 17px; width: 314px;'><span style='font-family: 微软雅黑;'>&nbsp;"+ state +"</span></td>"

					//project
					msg += "<tr><td style='height: 17px; width: 78px;'><span style='font-family: 微软雅黑;'>&ensp;&#x6240;&#x5C5E;&#x9879;&#x76EE;</span></td>"
						msg += "<td style='height: 17px; width: 314px;'><span style='font-family: 微软雅黑;'>&nbsp;"+ project +"</span></td>"

						msg += "</tbody>"
							msg += "</table>";
	//Note : This is a reminder email from PTC Integrity System, please don't reply !
	//msg += "<br/><br/><div><font size=2 color='red'><i>" + noteInfo + "</i></font></div>";
	msg += "</body>";
	msg += "</html>";
	return msg;

}

importPackage(Packages.org.apache.commons.codec.digest);
importPackage(Packages.org.apache.http);
importPackage(Packages.org.apache.http.client);
importPackage(Packages.org.apache.http.client.entity);
importPackage(Packages.org.apache.http.client.methods);
importPackage(Packages.org.apache.http.impl.client); 
importPackage(Packages.org.apache.http.message); 
importPackage(Packages.net.sf.json);
importPackage(Packages.com.dingtalk.api);
importPackage(Packages.com.dingtalk.api.request);
importPackage(Packages.com.dingtalk.api.response);
importPackage(Packages.com.taobao.api);
importPackage(Packages.newfis.dingtalk);



function dingMessage(receiveIds,userFullName){//通知到钉钉
//获取token信息
log("刚开始进入");
	try{
		var reciveId = receiveIds.get(0);
		//var message = userFullName + "：你有一个ID[" + itemId + "] 、state[" + state + "] 的 [" + type +"]需要处理。";
		var message = userFullName + "：Integrity系统中,项目经理已经调整项目成员配置，请您及时将配置变更项从测试环境推送到生产环境！";
		var dingTalkNotice = new DingTalkNotice();
		dingTalkNotice.sendMessage(reciveId,"text",message);
	}catch(e){
		e.printStackTrace();
		log("发送失败");
	}
}

log("------------------------- Check  All  Project  Dynamic  Group  By  Schedual start ------------------------");
main();
log("------------------------- Check  All  Project  Dynamic  Group  By  Schedual  end  -------------------------");

