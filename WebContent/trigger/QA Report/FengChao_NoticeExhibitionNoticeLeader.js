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

function isReply(delta){
	var noticeComment = delta.getFieldValue("Comment");
    var noticeUser = [ ];
    noticeUser = delta.getFieldValue("Notice Users").toString();
	var noticeUser2 = noticeUser.substring(1,noticeUser.length()-1);
	var noticeUser3 = noticeUser2.split(",");

	var notUser = "";
	for(var i =0;i<noticeUser3.length;i++){
		var user = noticeUser3[i];			
		if(noticeComment.indexOf(user.trim()) == -1){
			notUser += getUserName(user.trim())+",";
		}
	}
	//log("----------------" + notUser);
	return notUser;
} 

function log(s){
    Packages.mks.util.Logger.message(s);
}

function documentCommentCheck(){

	log("...Schedual Send Item Length ---------------=" + allItemIds.length);
	if(!allItemIds || allItemIds.length == 0){
		return;
	}
	
	for(var i=0; i<allItemIds.length; i++){
		var delta = sb.getIssueBean(allItemIds[i]);
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
			log("----------------" + isReply(delta));
			eb.abortScript("No reply personnel : " + isReply(delta),true);
			return;
		}
	}

	
	 
}

///START

eb = bsf.lookupBean("siEnvironmentBean");//环境变量
log("----- eb = " +  eb);
sb = bsf.lookupBean("imServerBean");//全部服务对象
log("----- sb = " +  sb);
//delta = bsf.lookupBean("imIssueDeltaBean");//触发对象
stb = bsf.lookupBean("imScheduleTriggerArgumentsBean");
allItemIds = stb.getIssues();
//log("----- delta = " +  delta.getID());
//log("----- oldState =" + delta.getOldState());
//log("----- newState =" + delta.getNewState());
documentCommentCheck();