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
	
    var noticeComment = delta.getFieldValue("Comment");
    var noticeUser = [ ];
    noticeUser = delta.getFieldValue("Notice Users").toString();
	log("Notice Users1  =  " + noticeUser);
	var noticeUser2 = noticeUser.substring(1,noticeUser.length()-1);
	log("Notice Users2  =  " + noticeUser2);
	var noticeUser3 = noticeUser2.split(",");

	var fla = true;
	var notUser = "";
	for(var i =0;i<noticeUser3.length;i++){
		var user = noticeUser3[i];
		//log("Notice Users  =  " + user.trim());
		//log("Notice comment  =  " + noticeComment);
		
		log(noticeComment.indexOf(user.trim()));
			
		if(noticeComment.indexOf(user.trim()) == -1){
			fla = false;
			notUser += getUserName(user.trim())+",";
			log("sb.getUserBean(user.trim())  =  " + getUserName(user.trim()));
		}
	}
	
	if(fla){
		//delta.setState("Closed");
		log("已查看及回复Defect横展通知!");
	} else {
		log(notUser +"未查看及回复Defect横展通知!");
		//eb.abortScript(notUser +"未查看及回复Defect横展通知!",true);
		eb.abortScript(notUser +"Failed to view and respond to Defect outspread notification!",true);
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