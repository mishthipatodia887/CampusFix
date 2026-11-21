var KEY="cms_complaints_v1",CATS=["Service","Billing","Facilities","Staff conduct","Technical","Other"],STAT=["Submitted","In progress","Resolved","Rejected"],mem=null,admin=false,tid="",flt={q:"",s:"",c:""},receipt=null,DL={save:function(o){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([o.data],{type:"text/csv"}));a.download=o.filename;document.body.appendChild(a);a.click();a.remove();return Promise.resolve()}};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function load(){try{var r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}return mem}
function save(){mem=D;try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}}
function ago(d){return new Date(Date.now()-d*864e5).toISOString()}
function seed(){var s=[["Ravi Sharma","Billing","High","Charged twice this month","My invoice shows two identical payments on the 3rd. Please refund the duplicate.","In progress",5],["Meera Joshi","Facilities","Medium","Lift out of order","The lift in Block B has not worked for four days.","Submitted",2],["Arjun Patel","Service","Low","Slow response on support line","Waited 40 minutes before anyone picked up.","Resolved",9],["Sara Khan","Technical","High","Cannot log in to the portal","Password reset email never arrives.","Submitted",1]];
return s.map(function(x,i){var l=[{t:ago(x[6]),s:"Submitted",n:"Complaint received."}];if(x[5]!="Submitted")l.push({t:ago(x[6]-1),s:x[5],n:x[5]=="Resolved"?"Issue fixed and confirmed with the customer.":"Our team is looking into this."});return{id:"CMP-"+(10230+i*37),name:x[0],email:x[0].split(" ")[0].toLowerCase()+"@example.com",phone:"",cat:x[1],pri:x[2],subject:x[3],desc:x[4],status:x[5],created:ago(x[6]),log:l}})}
var D=load()||seed();save();
function fmt(t){return new Date(t).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}
function chip(s){return '<span class="chip st-'+s.replace(" ","-")+'">'+s+'</span>'}
function newId(){var id;do{id="CMP-"+(10000+Math.floor(Math.random()*90000))}while(D.some(function(c){return c.id==id}));return id}
function opts(a,v,all){return (all?'<option value="">'+all+'</option>':'')+a.map(function(x){return '<option'+(x==v?' selected':'')+'>'+x+'</option>'}).join('')}

function viewFile(){
var left='<div><h1>Tell us what went wrong</h1><p class="lead">File a complaint in a minute. You will get a reference number to follow its progress.</p><ol class="steps"><li><b>You submit</b><span>Describe the problem and how to reach you.</span></li><li><b>We review</b><span>A staff member picks it up and posts updates.</span></li><li><b>You get an answer</b><span>Track the status any time with your reference number.</span></li></ol></div>';
var right;
if(receipt){right='<div class="card"><div class="receipt"><div class="muted">Complaint received. Your reference number is</div><div class="tid">'+receipt+'</div><div class="muted">Keep this number. You need it to track your complaint.</div><div class="acts"><button class="btn" data-act="trk">Track this complaint</button><button class="btn ghost" data-act="again">File another</button></div></div></div>'}
else{right='<form class="card" id="f" novalidate><h2>New complaint</h2><div class="row"><div><label for="n">Full name</label><input id="n" autocomplete="name" required></div><div><label for="e">Email</label><input id="e" type="email" autocomplete="email" required></div></div><div class="row"><div><label for="p">Phone <span class="opt">(optional)</span></label><input id="p" type="tel" autocomplete="tel"></div><div><label for="c">Category</label><select id="c">'+opts(CATS)+'</select></div></div><label for="r">Priority</label><select id="r">'+opts(["Low","Medium","High"],"Medium")+'</select><label for="s">Subject</label><input id="s" maxlength="80" required><label for="d">What happened?</label><textarea id="d" required></textarea><label for="a">Photo <span class="opt">(optional)</span></label><input id="a" type="file" accept="image/*"><p class="err" id="err" role="alert"></p><button class="btn" type="button" data-sub="1">Submit complaint</button></form>'}
return '<section class="split">'+left+right+'</section>'}

function detailHtml(c){
var i=STAT.indexOf(c.status),rej=c.status=="Rejected",steps=rej?["Submitted","Rejected"]:["Submitted","In progress","Resolved"],at=steps.indexOf(c.status);
return '<div class="muted">'+c.id+' · filed '+fmt(c.created)+'</div><h2>'+esc(c.subject)+'</h2><div style="margin:8px 0">'+chip(c.status)+'</div><div class="tr">'+steps.map(function(s,k){return '<div'+(k<=at?' class="on"':'')+'>'+s+'</div>'}).join('')+'</div><div class="desc">'+esc(c.desc)+'</div>'+(c.img?'<img class="att" src="'+c.img+'" alt="Attached photo">':'')+'<ul class="log">'+c.log.slice().reverse().map(function(l){return '<li><b>'+l.s+'</b> <small>'+fmt(l.t)+'</small><br>'+esc(l.n)+'</li>'}).join('')+'</ul>'}

function viewTrack(){
var c=tid&&D.filter(function(x){return x.id==tid.toUpperCase()})[0],res="";
if(tid)res=c?'<div class="card" style="margin-top:18px">'+detailHtml(c)+'</div>':'<p class="err">No complaint found with that reference. Check the number and try again.</p>';
return '<div style="max-width:620px"><h1>Track your complaint</h1><p class="lead">Enter the reference number you received, for example CMP-10230.</p><form id="tf" class="bar"><input id="ti" placeholder="CMP-12345" value="'+esc(tid)+'" aria-label="Reference number" style="flex:3 1 200px"><button class="btn" type="button" data-sub="1">Check status</button></form>'+res+'</div>'}

function shrink(f,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,900/Math.max(im.width,im.height)),cv=document.createElement("canvas");cv.width=im.width*k;cv.height=im.height*k;cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);cb(cv.toDataURL("image/jpeg",.7))};im.onerror=function(){cb()};im.src=r.result};r.onerror=function(){cb()};r.readAsDataURL(f)}
function late(c){return c.status!="Resolved"&&c.status!="Rejected"&&(Date.now()-new Date(c.created))/864e5>(c.pri=="High"?3:7)}
function chartHtml(){var n=function(k){return D.filter(function(c){return c.cat==k}).length},m=Math.max.apply(null,CATS.map(n).concat([1])),rate=Math.round(D.filter(function(c){return c.status=="Resolved"}).length/Math.max(D.length,1)*100),od=D.filter(late).length;return '<b>Resolution rate '+rate+'% · '+od+' overdue</b>'+CATS.map(function(k){return '<div class="r"><span>'+k+'</span><span class="t"><i style="width:'+n(k)/m*100+'%"></i></span><b>'+n(k)+'</b></div>'}).join('')}
function viewStaff(){
if(!admin)return '<div style="max-width:420px"><h1>Staff sign in</h1><p class="lead">Sign in to review and update complaints.</p><form class="card" id="lf"><label for="em">Email</label><input id="em" type="email" autocomplete="username" value="admin@example.com"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password"><p class="err" id="err" role="alert"></p><button class="btn" type="button" data-sub="1">Sign in</button></form></div>';
var cnt=function(s){return D.filter(function(c){return c.status==s}).length};
var L=D.filter(function(c){var q=flt.q.toLowerCase();return(!flt.s||c.status==flt.s)&&(!flt.c||c.cat==flt.c)&&(!q||(c.id+c.name+c.subject+c.email).toLowerCase().indexOf(q)>-1)}).sort(function(a,b){return new Date(b.created)-new Date(a.created)});
return '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><h1 style="margin:0;font-size:2rem">Complaints</h1><span style="display:flex;gap:8px"><button class="btn ghost" data-act="csv" id="xb" hidden>Export CSV</button><button class="btn ghost" data-act="out">Sign out</button></span></div><div class="stats"><div class="stat"><b>'+D.length+'</b><span>Total</span></div><div class="stat"><b>'+cnt("Submitted")+'</b><span>Waiting for review</span></div><div class="stat"><b>'+cnt("In progress")+'</b><span>In progress</span></div><div class="stat"><b>'+cnt("Resolved")+'</b><span>Resolved</span></div></div><div class="card ch" style="padding:16px 18px">'+chartHtml()+'</div><div class="bar"><input id="fq" placeholder="Search by name, subject or reference" value="'+esc(flt.q)+'" aria-label="Search"><select id="fs" aria-label="Status">'+opts(STAT,flt.s,"All statuses")+'</select><select id="fc" aria-label="Category">'+opts(CATS,flt.c,"All categories")+'</select></div><div class="list">'+(L.length?L.map(function(c){return '<button class="item" data-id="'+c.id+'"><span class="id">'+c.id+'</span><span class="sb">'+esc(c.subject)+'<small>'+esc(c.name)+' · '+c.cat+' · '+fmt(c.created)+(late(c)?' · <span class="od">Overdue</span>':'')+'</small></span><span class="pr-'+c.pri+'"><b>'+c.pri+'</b></span>'+chip(c.status)+'</button>'}).join(''):'<div class="empty">No complaints match these filters.</div>')+'</div>'}

var VIEWS=["file","track","staff"],view=VIEWS.indexOf(location.hash.slice(1))<0?"file":location.hash.slice(1);
function go(h){view=h;if(h!="file")receipt=null;try{history.replaceState(null,"","#"+h)}catch(e){}render();window.scrollTo(0,0)}
function render(){
var h=view;
document.querySelectorAll("#nav a").forEach(function(a){if(a.getAttribute("href")=="#"+h)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
var focus=document.activeElement&&document.activeElement.id,pos=document.activeElement&&document.activeElement.selectionStart;
document.getElementById("app").innerHTML=h=="track"?viewTrack():h=="staff"?viewStaff():viewFile();
var xb=document.getElementById("xb");if(xb&&DL)xb.hidden=false;
if(focus&&/^f[qsc]$/.test(focus)){var el=document.getElementById(focus);if(el){el.focus();if(pos!=null&&el.setSelectionRange)try{el.setSelectionRange(pos,pos)}catch(e){}}}}

function openDetail(id){
var c=D.filter(function(x){return x.id==id})[0];if(!c)return;var d=document.getElementById("dlg");
d.innerHTML=detailHtml(c)+'<dl class="kv"><dt>Name</dt><dd>'+esc(c.name)+'</dd><dt>Email</dt><dd>'+esc(c.email)+'</dd>'+(c.phone?'<dt>Phone</dt><dd>'+esc(c.phone)+'</dd>':'')+'<dt>Category</dt><dd>'+c.cat+'</dd><dt>Priority</dt><dd>'+c.pri+'</dd></dl>'+(c.notes&&c.notes.length?'<b>Internal notes</b>'+c.notes.map(function(x){return '<div class="note">'+esc(x.n)+' <small>'+(x.by?x.by+', ':'')+fmt(x.t)+'</small></div>'}).join(''):'')+'<form id="uf" data-id="'+c.id+'"><label for="ua">Assigned to</label><select id="ua">'+opts(["Unassigned","Priya Nair","Rahul Mehta","Anita Das"],c.who||"Unassigned")+'</select><label for="us">Status</label><select id="us">'+opts(STAT,c.status)+'</select><label for="un">Message to the customer</label><textarea id="un" style="min-height:70px" placeholder="Shown on the tracking page"></textarea><label for="ui">Internal note <span class="opt">(staff only, never shown to the customer)</span></label><textarea id="ui" style="min-height:60px"></textarea><div class="acts"><button class="btn" type="button" data-sub="1">Save update</button><a class="btn ghost" style="text-decoration:none" href="mailto:'+encodeURIComponent(c.email)+'?subject='+encodeURIComponent('Update on '+c.id)+'&body=Hello%20'+encodeURIComponent(c.name)+'%2C%0A%0AYour%20complaint%20'+c.id+'%20is%20now%3A%20'+encodeURIComponent(c.status)+'.">Email customer</a><button class="btn ghost" type="button" data-act="close">Close</button><button class="btn danger" type="button" data-act="del" data-id="'+c.id+'" style="margin-left:auto">Delete</button></div></form>';
if(d.showModal)d.showModal();else d.setAttribute("open","")}

function onSubmit(f){
if(f.id=="f"){var v=function(i){return document.getElementById(i).value.trim()},er=document.getElementById("err");
if(!v("n")||!v("s")||!v("d")){er.textContent="Please fill in your name, a subject and a description.";return}
if(!/^\S+@\S+\.\S+$/.test(v("e"))){er.textContent="Enter a valid email address so we can reach you.";return}
var c={id:newId(),name:v("n"),email:v("e"),phone:v("p"),cat:v("c"),pri:v("r"),subject:v("s"),desc:v("d"),status:"Submitted",created:new Date().toISOString(),log:[{t:new Date().toISOString(),s:"Submitted",n:"Complaint received."}]};
var fl=document.getElementById("a").files[0],fin=function(img){if(img)c.img=img;D.push(c);save();receipt=c.id;render()};if(!fl)fin();else shrink(fl,fin)}
else if(f.id=="tf"){tid=document.getElementById("ti").value.trim();render()}
else if(f.id=="lf"){if(document.getElementById("em").value.trim().toLowerCase()=="admin@example.com"&&document.getElementById("pw").value=="admin123"){admin=true;render()}else document.getElementById("err").textContent="Wrong email or password."}
else if(f.id=="uf"){var c2=D.filter(function(x){return x.id==f.dataset.id})[0],s=document.getElementById("us").value,n=document.getElementById("un").value.trim();
var nt=document.getElementById("ui").value.trim();if(nt){(c2.notes=c2.notes||[]).push({t:new Date().toISOString(),n:nt,by:"Admin"});save()}
var w=document.getElementById("ua").value;if(w!=(c2.who||"Unassigned")){c2.who=w;c2.log.push({t:new Date().toISOString(),s:c2.status,n:"Assigned to "+w+"."});save()}
if(s!=c2.status||n){c2.status=s;c2.log.push({t:new Date().toISOString(),s:s,n:n||"Status changed to "+s+"."});save()}
document.getElementById("dlg").close();render()}}
document.addEventListener("submit",function(e){e.preventDefault();onSubmit(e.target)});
document.addEventListener("keydown",function(e){var t=e.target;if(e.key=="Enter"&&t.tagName=="INPUT"&&t.type!="file"&&t.form&&t.form.querySelector("[data-sub]")){e.preventDefault();onSubmit(t.form)}});
document.addEventListener("click",function(e){
var g=e.target.closest("[data-go]");if(g){e.preventDefault();go(g.dataset.go);return}
var sb=e.target.closest("[data-sub]");if(sb){onSubmit(sb.closest("form"));return}
var t=e.target.closest("[data-act],[data-id]");if(!t)return;var a=t.dataset.act;
if(a=="trk"){tid=receipt;go("track")}
else if(a=="again"){receipt=null;render()}
else if(a=="csv"&&DL){var q=function(x){return '"'+String(x).replace(/"/g,'""')+'"'};DL.save({filename:"complaints-report.csv",data:[["ID","Name","Email","Category","Priority","Status","Assigned to","Filed","Subject"]].concat(D.map(function(c){return[c.id,c.name,c.email,c.cat,c.pri,c.status,c.who||"Unassigned",c.created.slice(0,10),c.subject]})).map(function(r){return r.map(q).join(",")}).join("\r\n")}).catch(function(){})}
else if(a=="out"){admin=false;render()}
else if(a=="close")document.getElementById("dlg").close();
else if(a=="del"){if(!t.dataset.sure){t.dataset.sure="1";t.textContent="Click again to confirm";return}D=D.filter(function(x){return x.id!=t.dataset.id});save();document.getElementById("dlg").close();render()}
else if(t.classList.contains("item"))openDetail(t.dataset.id)});
document.addEventListener("input",function(e){var i=e.target.id;if(i=="fq"){flt.q=e.target.value;render()}});
document.addEventListener("change",function(e){var i=e.target.id;if(i=="fs"){flt.s=e.target.value;render()}if(i=="fc"){flt.c=e.target.value;render()}});
window.addEventListener("hashchange",function(){var h=location.hash.slice(1);if(VIEWS.indexOf(h)>-1){view=h;if(h!="file")receipt=null;render()}});
render();

