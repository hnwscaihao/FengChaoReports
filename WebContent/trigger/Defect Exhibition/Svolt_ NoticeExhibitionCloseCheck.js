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
//已回复用户是否上传附件
function getfj(user){
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
		log("createdBys================"+createdBys);
		log("user[i]================="+user[i]);
		log(createdBys.indexOf(user[i]) == -1);
		
		if(createdBys.indexOf(user[i]) == -1){ //判断已回复人员在不在上传附件的人员中
			log("yi hui fu yong hu wei shangchuang fujian :"+user[i]);
			ls.push(user[i]);
		}
	}
	
	return ls;//返回已回复但没有上传附件的用户
}

function getUserName(user){
    var srt = "";
	var str1 = sb.getUserBean(user).getFullName();
	str = str1 + "(" + user + ")";
    return str;
}

 // 打印信息
function log(s){
    Packages.mks.util.Logger.message(s);
}

function documentCommentCheck(){
	log("----------------------------------------------");
	
    var noticeComment = delta.getFieldValue("Comment") == null ? "" : delta.getFieldValue("Comment");
    var noticeUser = [ ];
    noticeUser = delta.getFieldValue("Notice Users").toString();
	log("Notice Users1  =  " + noticeUser);
	var noticeUser2 = noticeUser.substring(1,noticeUser.length()-1);
	log("Notice Users2  =  " + noticeUser2);
	var noticeUser3 = noticeUser2.split(",");

	var fla = true;
	var notUser = [];
	var personReplied = [];//已回复人员
	for(var i =0;i<noticeUser3.length;i++){
		var user = noticeUser3[i];
		//log("Notice Users  =  " + user.trim());
		//log("Notice comment  =  " + noticeComment);
		
		log("noticeComment----------------"+noticeComment);
			
		if(noticeComment.indexOf(user.trim()) == -1){
			fla = false;
			//notUser += getUserName(user.trim())+",";
			notUser.push(getUserName(user.trim())); 
		}else {
			log("已回复通知！");
			//personReplied = getUserName(user.trim())+","; 
			personReplied.push(getUserName(user.trim()));
		}
	} 
	var personRepliedName = getfj(personReplied); //获取已回复但是没有上传附件的用户 
	if(personRepliedName.length > 0){
		//notUser += personRepliedName;
		for(var i =0;i<personRepliedName.length;i++){
			notUser.push(personRepliedName);
		}
	}
	var sendName = "";  //拼接需要通知的用户
	for(var i=0;i<notUser.length;i++){
		sendName += notUser[i]+",";
	}
	
	log("sendName---------"+sendName);
	if(notUser.length > 0){ //已回复
		log(notUser +"未查看及回复Defect横展通知!");
		//eb.abortScript(notUser +"未查看及回复Defect横展通知!",true);
		eb.abortScript(sendName +"Failed to view and respond to Defect outspread notification!",true); 
	} else {
		log("已查看及回复Defect横展通知!");
	}
	
	log("===================================================");
	
	 
}

///START

eb = bsf.lookupBean("siEnvironmentBean");//环境变量
log("----- eb = " +  eb);
sb = bsf.lookupBean("imServerBean");//全部服务对象
log("----- sb = " +  sb);
delta = bsf.lookupBean("imIssueDeltaBean");//触发对象
 
log("----- delta = " +  delta.getID());
log("----- oldState =" + delta.getOldState());
log("----- newState =" + delta.getNewState());
documentCommentCheck();