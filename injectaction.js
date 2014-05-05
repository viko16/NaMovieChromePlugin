if(document.getElementsByClassName("play960").length!=0){
var scriptConfig = {
  none2block: false,
  formid: false,
  documentid: false
};
var FLASH_CLSID = '{d27cdb6e-ae6d-11cf-96b8-444553540000}';
var typeId = 'application/x-itst-activex';
var updating = false;
var easyUTF8 = function(gbk){  
    if(!gbk){return '';}  
    var utf8 = [];  
    for(var i=0;i<gbk.length;i++){  
        var s_str = gbk.charAt(i);  
        if(!(/^%u/i.test(escape(s_str)))){utf8.push(s_str);continue;}  
        var s_char = gbk.charCodeAt(i);  
        var b_char = s_char.toString(2).split('');  
        var c_char = (b_char.length==15)?[0].concat(b_char):b_char;  
        var a_b =[];  
        a_b[0] = '1110'+c_char.splice(0,4).join('');  
        a_b[1] = '10'+c_char.splice(0,6).join('');  
        a_b[2] = '10'+c_char.splice(0,6).join('');  
        for(var n=0;n<a_b.length;n++){  
            utf8.push('%'+parseInt(a_b[n],2).toString(16).toUpperCase());  
        }  
    }  
    return utf8.join('');  
};  
function executeScript(script) {
  var scriptobj = document.createElement('script');
  scriptobj.innerHTML = script;

  var element = document.head || document.body ||
      document.documentElement || document;
  element.insertBefore(scriptobj, element.firstChild);
  element.removeChild(scriptobj);
}

function checkParents(obj) {
  var parent = obj;
  var level = 0;
  while (parent && parent.nodeType == 1) {
    if (getComputedStyle(parent).display == 'none') {
      var desp = obj.id + ' at level ' + level;
      if (scriptConfig.none2block) {
        parent.style.display = 'block';
        parent.style.height = '0px';
        parent.style.width = '0px';      
      } else {       
      }
    }
    parent = parent.parentNode;
    ++level;
  }
}

function getLinkDest(url) {
  if (typeof url != 'string') {
    return url;
  }
  url = url.trim();
  if (/^https?:\/\/.*/.exec(url)) {
    return url;
  }
  if (url[0] == '/') {
    if (url[1] == '/') {
      return location.protocol + url;
    } else {
      return location.origin + url;
    }
  }
  return location.href.replace(/\/[^\/]*$/, '/' + url);
}

var hostElement = null;
function enableobj(obj) {
  updating = true;
  // We can't use classid directly because it confuses the browser.
  obj.setAttribute('clsid', getClsid(obj));
  obj.removeAttribute('classid');
  checkParents(obj);

  var newObj = obj.cloneNode(true);
  newObj.type = typeId;
  // Remove all script nodes. They're executed.
  var scripts = newObj.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; ++i) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  // Set codebase to full path.
  var codebase = newObj.getAttribute('codebase');
  if (codebase && codebase != '') {
    newObj.setAttribute('codebase', getLinkDest(codebase));
  }

  newObj.activex_process = true;
  obj.parentNode.insertBefore(newObj, obj);
  obj.parentNode.removeChild(obj);
  obj = newObj;

  if (obj.id) {
    var command = '';
    if (obj.form && scriptConfig.formid) {
      var form = obj.form.name;
      command += 'document.all.' + form + '.' + obj.id;
      command += ' = document.all.' + obj.id + ';\n';     
    }

    // Allow access by document.obj.id
    if (obj.id && scriptConfig.documentid) {
      command += 'delete document.' + obj.id + ';\n';
      command += 'document.' + obj.id + '=' + obj.id + ';\n';
    }
    if (command) {
      executeScript(command);
    }
  }
  updating = false;
  return obj;
}

function getClsid(obj) {
  if (obj.hasAttribute('clsid'))
    return obj.getAttribute('clsid');
  var clsid = obj.getAttribute('classid');
  var compos = clsid.indexOf(':');
  if (clsid.substring(0, compos).toLowerCase() != 'clsid')
    return;
  clsid = clsid.substring(compos + 1);
  return '{' + clsid + '}';
}

function notify(data) {
  connect();
  data.command = 'DetectControl';
  port.postMessage(data);
}

function process(obj) {
  if (obj.activex_process)
    return;

  obj.activex_process = true;
 
  var clsid = getClsid(obj);


    obj = enableobj(obj);
   }

function replaceSubElements(obj) {
  var s = obj.querySelectorAll('object[classid]');
  if (obj.tagName == 'OBJECT' && obj.hasAttribute('classid')) {
    s.push(obj);
  }
  for (var i = 0; i < s.length; ++i) {
    process(s[i]);
  }
}

function onBeforeLoading(event) {
  var obj = event.target;
  if (obj.nodeName == 'OBJECT') { 
    if (process(obj)) {
      event.preventDefault();
    }
  }
}

function onError(event) {
  var message = 'Error: ';
  message += event.message;
  message += ' at ';
  message += event.filename;
  message += ':';
  message += event.lineno;  
  return false;
}

function setUserAgent() {
  if (!config.pageRule) {
    return;
  }

  var agent = getUserAgent(config.pageRule.userAgent);
  if (agent && agent != '') { 
    var js = '(function(agent) {';
    js += 'delete navigator.userAgent;';
    js += 'navigator.userAgent = agent;';

    js += 'delete navigator.appVersion;';
    js += "navigator.appVersion = agent.substr(agent.indexOf('/') + 1);";

    js += "if (agent.indexOf('MSIE') >= 0) {";
    js += 'delete navigator.appName;';
    js += 'navigator.appName = "Microsoft Internet Explorer";}})("';
    js += agent;
    js += '")';
    executeScript(js);
  }
}

function onSubtreeModified(e) {
  if (updating) {
    return;
  }
  if (e.nodeType == e.TEXT_NODE) {
    return;
  }
  replaceSubElements(e.srcElement);
}

setTimeout(function(){if (document.getElementById("playerNoInstall")){ 
	document.getElementById("playerNoInstall").style.display = 'none';
    }
    if (document.getElementById("play")) document.getElementById("play").style.display = 'block';   
document.getElementsByTagName("object")[0].setAttribute("width",960);
document.getElementsByName("url")[0].value=easyUTF8(document.getElementsByName("url")[0].value);
document.getElementsByTagName("object")[0].setAttribute("activex_process",false);
		  process(document.getElementsByTagName("object")[0]);
		  },parseInt(document.getElementById("adloadtime").value)
		  )
		  }