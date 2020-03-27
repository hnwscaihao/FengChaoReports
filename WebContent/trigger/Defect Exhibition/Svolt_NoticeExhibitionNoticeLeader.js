//
// <b>Integrity Manager POST-Event Trigger</b>
// <p>
//
// @param String Subject
//
// @param String Title
//
// @param String Note Info


function abort(s){
    eb.abortScript(s, true);
}

function log(s){
    eb.print(s);
}
log("Start Notice Exhibition Leader");

var eb = bsf.lookupBean("siEnvironmentBean");//环境变量
eb.setMessageCategory("SVOLT");//设置日志分类
//log("----- eb = " +  eb);
var server = bsf.lookupBean("imServerBean");//全部服务对象
//log("----- server = " +  server);

var stb = bsf.lookupBean("imScheduleTriggerArgumentsBean"); //触发对象
allItemIds = stb.getIssues();

var params = bsf.lookupBean("parametersBean");
//log("----- delta = " +  delta.getID());
//log("----- oldState =" + delta.getOldState());
//log("----- newState =" + delta.getNewState());
 
var RecipientMailbox = [];//收件人
var assignUser = "";//收件用户
																					
var createUser;
//触发器参数
var subject = params.getParameter("Subject");

var title = params.getParameter("Title");

var noteInfo = params.getParameter("Note Info");

var fromAddr = "alm@gwm.cn";

var toList = new java.util.ArrayList();//装邮箱的集合 emailAddress

var receiveIds = [];//装app推送接受人的集合 logid

var hostPort = eb.getMailHostnameAndPort();

var host = hostPort[0];

var smtpPort = hostPort[1];

var userFullName = "";

var content = "";
if (host == null || host.length() == 0){
       abort("host is null!");
}   

// default to 25
if ( smtpPort == null || smtpPort.length() == 0 ) {
       smtpPort = "25";
}

var hostUrl = eb.getHostURL();
var mksHost = eb.getHostname();
var mksPort = eb.getHostPort();



function printParams(){
       log("----subject="+subject);
       log("----title="+title);
       log("----fromAddr="+fromAddr);
       log("----host="+host);
       log("----smtpPort="+smtpPort);
       log("----hostUrl="+hostUrl);
       log("----mksHost="+mksHost);
       log("----mksPort="+mksPort);

}


//importPackage(Packages.javax.mail);

importPackage(Packages.javax.activation);
importPackage(Packages.javax.mail.internet);
importPackage(Packages.org.apache.commons.mail);
importPackage(java.lang);


/**
* Send email to the list of target users found in ``toList'';
* indicate it is from the user in ``from''.  Send it thru the mail
* server found in ``host''.
* Two versions of the message are sent, an html and text version.
*/


//发送邮件
function sendMailToUser(toList,text, html){ 	
	 // 这里是SMTP发送服务器的名字：163的如下："smtp.163.com"  
	log("Start");
	var email = new HtmlEmail();
	email.setHostName(host);
	// 字符编码集的设置  
	email.setCharset("UTF-8");
	// 发送人的邮箱
	email.setFrom("alm@gwm.cn", "ALM");  
	// 如果需要认证信息的话，设置认证：用户名-密码。分别为发件人在邮件服务器上的注册名称和密码  //服务器只能保存用户名，不能保存密密码
	email.setAuthentication("alm@gwm.cn", "123@alm.com");
	//主题
	var currSubject = "To : " + assignUser;
	if(createUser && createUser != ""){
		currSubject = currSubject + "," +  createUser;
	} 
	currSubject  = currSubject + " ! " + text ;
	log("currSubject=-------"+currSubject)
	// 设置收件人信息
	for (var a = 0; a < toList.size(); a++){
		log("---- Email To: " + toList.get(a));
		//email.addTo(toList.get(a));	
		
    }
	//收件人
	email.addTo("liuxiaoguang@newfis.com");
	// 设置抄送人信息
	//setCc(email, mail);
	// 设置密送人信息
	//setBcc(email, mail);
	// 要发送的邮件主题  
	email.setSubject(currSubject);
	
	// 要发送的信息，由于使用了HtmlEmail，可以在邮件内容中使用HTML标签  
	email.setHtmlMsg(html);
	
	//发送
	email.send();
	log("Success");
}

//已回复用户是否上传附件
function getfj(user,delta){
	log("yi hui fu yong hu :"+user);
	 
	var ls = [];
	var createdBys = ""; //获取上传附件的人员
	var attachmentBeans	= delta.getAttachmentBeans("Attachments");//获取所有附件
	for(var j = 0 ;j<attachmentBeans.length;j++){
		var attachmentBean = attachmentBeans[j];
		log("yi shang chuang fujian de yong hu "+attachmentBean.getCreatedBy());
		var createdBy = attachmentBean.getCreatedBy();//附件的创建用户
		createdBys += getUserName(createdBy.trim())+",";
	}
	 
	for(var i =0;i<user.length;i++){
		var personReplied = getUserName(user[i]); 
		log("createdBys================"+createdBys);
		log("user[i]================="+personReplied); 
		
		if(createdBys.indexOf(personReplied) == -1){ //判断已回复人员在不在上传附件的人员中
			log("yi hui fu yong hu wei shangchuang fujian :"+personReplied);
			ls.push(personReplied);
			
			RecipientMailbox.push(user[i]);   //邮件人员
			assignUser += personReplied+",";//名字
			//丁丁
			//receiveIds.add(user.trim());
			//userFullName = server.getUserBean(user.trim()).getFullName();
			var obj = {};
			obj.id = user[i];
			obj.name = server.getUserBean(user[i]).getFullName();
			receiveIds.push(obj);
		}
	}
	
	return ls;//返回已回复但没有上传附件的用户
}

//用户(权限)
function getUserName(user){
    var srt = "";
	var str1 = server.getUserBean(user).getFullName();
	str = str1 + "(" + user + ")";
    return str;
}

//延时未回复人员
function isReply(delta){
	var noticeComment = delta.getFieldValue("Comment");
	if(!noticeComment || noticeComment == null || noticeComment == "null"){
		noticeComment = "";
	}

    var noticeUser = [ ];
     var noticeUser = [];
	var noticeUser3 = [];
	var NoticeUsers = delta.getFieldValue("Notice Users");
	if(!NoticeUsers || NoticeUsers == null || NoticeUsers == "null"){
		NoticeUsers = ""; 
	}else {
	    noticeUser = NoticeUsers.toString();
	    var noticeUser2 = noticeUser.substring(1,noticeUser.length()-1);
	    noticeUser3 = noticeUser2.split(",");
	} 	var notUser = "";
	var personReplied = [];//已回复人员
	for(var i =0;i<noticeUser3.length;i++){
		var user = noticeUser3[i];			
		if(noticeComment.indexOf(user.trim()) == -1){
			notUser += getUserName(user.trim())+",";//延期人员
			RecipientMailbox.push(user.trim());   //邮件人员
			assignUser += getUserName(user.trim())+",";//名字
			//丁丁
			//receiveIds.add(user.trim());
			//userFullName = server.getUserBean(user.trim()).getFullName();
			var obj = {};
			obj.id = user.trim();
			obj.name = server.getUserBean(user.trim()).getFullName();
			receiveIds.push(obj);
			 //log("RecipientMailbox : " + RecipientMailbox[i]);
		}else {
			 
			personReplied.push(user.trim());
		} 
	}
	
	var personRepliedName = getfj(personReplied,delta); //获取已回复但是没有上传附件的用户 
	if(personRepliedName.length > 0){
		//notUser += personRepliedName;
		for(var i =0;i<personRepliedName.length;i++){
			 notUser += personRepliedName[i] + ",";
			
		}
	}
	
	log("notUser----------------" + notUser);
	return notUser;
} 

//获取动态组
function testPlanCheck(){
	if(!allItemIds || allItemIds.length == 0){
		return;
	}
	
	//获取PM动态组 Project Manager DG
	var PMDG = server.getDynamicGroupBean("Project Manager DG");
	//log("Project Manager DG");
	for(var i=0; i<allItemIds.length; i++){
		var delta = server.getIssueDeltaBean(allItemIds[i]);
		var project = delta.getProject();
		//log("Project = " + project);
		//获取PM动态组的人员 Project Manager DG
		var users = PMDG.getUsers(project);
		//log("PM Users : " + users.length);
		for(var a = 0;a<users.length;a++){
			RecipientMailbox.push(users[a].trim());
			assignUser += getUserName(users[a].trim())+",";
			//钉钉
			//receiveIds.add(users[a].trim());
			//userFullName = server.getUserBean(users[a].trim()).getFullName();
			var obj = {};
			obj.id = users[a].trim();
			obj.name = server.getUserBean(users[a].trim()).getFullName();
			receiveIds.push(obj);
			//log("User1 = " + users[a]);
		}
		
	}	
}

//根据用户查询邮箱
function getUserByEmail(){
	for(var i = 0 ; i < RecipientMailbox.length;i++){
                    
		var userBean = server.getUserBean(RecipientMailbox[i]);
				
        var toAddr = userBean.getEmailAddress();
			
		if(toAddr != null && toAddr != ""){
			if(toAddr.indexOf(";")>-1){
				toAddr = toAddr.replace(";","");
			}
		//	log("send email to address : " + toAddr);
			toList.add(toAddr); 
	    }
    }
}


//判断是否延期
function main(){

	log("...Schedual Send Item Length ---------------=" + allItemIds.length);
	if(!allItemIds || allItemIds.length == 0){
		return;
	}
	
	for(var i=0; i<allItemIds.length; i++){
		var delta = server.getIssueBean(allItemIds[i]); 
		var DelayNoticeDateStr  = delta.getFieldValue("Delay Notice Date");
		log("Delay Notice Date  =  " + DelayNoticeDateStr);
	
		var DelayNoticeDate = new Date(DelayNoticeDateStr);
		//判断计划结束日期是否小于当前日期
		var currentTime = new Date().getTime();
			
		var DelayNoticeDay = Math.floor((DelayNoticeDate.getTime())/(60 * 1000 * 60 * 24));
		var  currentDay = Math.floor(currentTime/(60 * 1000 * 60 * 24));
		log("DelayNoticeDay   : "+ DelayNoticeDay );
		log("currentDay : "+ currentDay );
		
		if( DelayNoticeDay < currentDay ){
			testPlanCheck();//获取Project Manager DG组的领导
			isReply(delta);//获取符合条件的用户
			getUserByEmail();//获取所有用户的邮箱
			//log("----------------" + isReply(delta));
			//eb.abortScript("No reply personnel : " + isReply(delta),true);
			//printParams(); //打印
			var body = createHTMLBody(delta); 
			
		
			//发送邮件
			try{
				
				sendMailToUser(toList,"Defect Notice Exhibition Unanswered", body);
			}catch(e){
				log(e);
			}
			//dingding
			try{
				dingMessage(delta);
			}catch(e){
				log("Connect DingDing error");
			}
			return;
		}
	}
	 
}

//钉钉jar
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
//通知到钉钉
function dingMessage(delta){
//获取token信息 
	try{ 
		var dingTalkNotice = new DingTalkNotice();
		var id = delta.getIssueIDString();
		var state = delta.getState();
		var type = delta.getType();
		for(var i = 0;i<receiveIds.length;i++){
			log("=================="+receiveIds[i].id);
			log("=================="+receiveIds[i].name);
			var reciveId = receiveIds[i].id;
			var userFullName = receiveIds[i].name;
			if(reciveId == 'admin'){  //测试判断  正式环境注释
				var message = userFullName + "：You have one ID[" + id + "] 、state[" + state + "] Of [" + type +"] Pending disposal.";
				log(message);
				dingTalkNotice.sendMessage(reciveId,"text",message);
				log("ddSuccess----------------");
			}
		}
	}catch(e){
		e.printStackTrace();
		log("发送失败");
	}
}

//邮件html格式
function createHTMLBody(delta){

	   var itemId = delta.getIssueIDString();
	   //log("-----------------------"+delta.getFieldValue("DaysRecordInCurrentState"));
       var type = delta.getType();
		 //log("type-----------------------"+type);
       var summary = delta.getSummary() == null ? "" : delta.getSummary();  
		//log("summary-----------------------"+summary);
       var state = delta.getState()  == null ? "" : delta.getState();    
		//log("state-----------------------"+state);
	   var project = delta.getFieldValue("Project") == null ? "" : delta.getFieldValue("Project"); 

	   var createUser = delta.getCreatedUser();

        var msg = "<html>";

       msg += "<head>";

       msg += "<title>Test Session Details for one test session</title>";

       msg += "<meta http-equiv='Content-Type' content='text/html;charset=utf-8' />";

       msg += "<style type='text/css'>";

      msg += "body {background-color:#FFFFFF; font-family: Verdana,Arial,Helvetica,Tahoma,sans-serif; font-size: 11px; color:#666666;}";

       msg += "</style>";

       msg += "</head>";

       msg += "<body>";

       msg += "<div><font size=2>Hi " + assignUser +": </font></br></div><br/>";      

       msg += "<div><font size=2 style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + title + " : " + state +" ,please view! </font></div><br/>"

       msg += "<table width='100%' cellspacing='0' cellpadding='3' >";

       //ID

       msg += "<tr><th align='left' width='30%'>ID</th><td align='left'><a href='"+ hostUrl + "/im/viewissue?selection=" + itemId + "'>" + itemId + "</a></td></tr>";

       //Type Name

       msg += "<tr><th align='left' width='30%'>Type Name</th><td align='left'>" + type + "</td></tr>";

       //Summary

       msg += "<tr><th align='left' width='30%'>Summary</th><td align='left'>" + summary + "</td></tr>";
    

       //State
       msg += "<tr><th align='left' width='30%'>State</th><td align='left'>" + state + "</td></tr>";
       //assignUser
       msg += "<tr><th align='left' width='30%'>Assign User</th><td align='left'>" + assignUser + "</td></tr>";
       //project
       msg += "<tr><th align='left' width='30%'>Project</th><td align='left'>" + project + "</td></tr>";
	   msg += "<tr><th align='left' width='30%'>Modify Date</th><td align='left'> not</td></tr>";
       msg += "</table>";
       //Note : This is a reminder email from PTC Integrity System, please don't reply !
       msg += "<br/><br/><div><font size=2 color='red'><i>" + noteInfo + "</i></font></div>";
       msg += "</body>";
       msg += "</html>";
	   
      return msg;

}
log("Defect Notice Leader Start");

//主判断方法
main();

log("Defect Notice Leader End");
//UTF字符转换
 function ReChange(pValue){
      return unescape(pValue.replace(/&#x/g,'%u').replace(/\\u/g,'%u').replace(/;/g,''));
}
