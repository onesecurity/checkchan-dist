const a0_0x3dd677=a0_0x2c43;(function(_0xf2dcc3,_0x43efb9){const _0xd0cb99=a0_0x2c43,_0x434b2e=_0xf2dcc3();while(!![]){try{const _0x244405=-parseInt(_0xd0cb99(0x103))/0x1*(parseInt(_0xd0cb99(0x109))/0x2)+parseInt(_0xd0cb99(0x10b))/0x3*(parseInt(_0xd0cb99(0x106))/0x4)+parseInt(_0xd0cb99(0x10a))/0x5+parseInt(_0xd0cb99(0x104))/0x6+-parseInt(_0xd0cb99(0x107))/0x7+parseInt(_0xd0cb99(0x102))/0x8*(parseInt(_0xd0cb99(0x10e))/0x9)+parseInt(_0xd0cb99(0x108))/0xa*(-parseInt(_0xd0cb99(0x105))/0xb);if(_0x244405===_0x43efb9)break;else _0x434b2e['push'](_0x434b2e['shift']());}catch(_0x3c68ee){_0x434b2e['push'](_0x434b2e['shift']());}}}(a0_0x2a97,0xb2e5c));let inspector={};console[a0_0x3dd677(0x10d)](a0_0x3dd677(0x10c));function a0_0x2c43(_0x22b3a5,_0x4ee1f4){const _0x2a97ed=a0_0x2a97();return a0_0x2c43=function(_0x2c43a1,_0x1ddab1){_0x2c43a1=_0x2c43a1-0x102;let _0x1095f2=_0x2a97ed[_0x2c43a1];return _0x1095f2;},a0_0x2c43(_0x22b3a5,_0x4ee1f4);}async function show_inspector(tabid,inspector){inspector=new DomInspector({maxZIndex:9999,onClick:async path=>{const url='index.html#/check/add?path='+encodeURIComponent(path)+'&title='+encodeURIComponent(window.document.title)+'&url='+encodeURIComponent(window.location.href);console.log(url);const ret=await chrome.runtime.sendMessage({action:'redirect','url':url,'tabid':tabid});console.log('ret',ret,inspector);window.location.reload();}});inspector.enable();alert('可视化选择器已初始化\uFF0C请移动鼠标选择要监测的区域后点击\uFF0C取消请按ESC');console.log('inspector2',inspector);document.addEventListener('keyup',e=>{if(e.key==='Escape')inspector.disable();});}async function ck_get_content(path,delay=3000){function sleep(ms){return new Promise(resolve=>{setTimeout(resolve,ms);});}function dom_ready(ms){return new Promise(resolve=>{const handle=setInterval(()=>{console.log(document.readyState);if(document.readyState=='complete'){clearInterval(handle);resolve(true);}},1000);if(ms)setTimeout(resolve,ms);});}function dom_mul_select(path){let ret=window.document.querySelectorAll(path);if(!ret)return false;let texts=[];let html='';for(let item of ret){item.querySelectorAll('[src]').forEach(item=>{if(item.src.substr(0,4)!='http'){item.src=window.origin+(item.src.substr(0,1)=='/'?item.src:'/'+item.src);}});if(item.innerText)texts.push(item.innerText?.trim());html+=item.outerHTML?item.outerHTML+'<br/>':'';}return{text:path.indexOf(',')>=0?texts.join('\n'):texts[0]||'',html};}await dom_ready();if(delay>0)await sleep(delay);const ret=dom_mul_select(path);if(ret){return ret;}else{await sleep(3000);const ret2=dom_mul_select(path);if(ret2){return ret2;}else{await sleep(3000);const ret3=dom_mul_select(path);if(ret3)return ret;}}return false;}chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{if(request.action==='redirect'){((async()=>{const [tab]=await chrome.tabs.query({title:'Check酱'});const tab2=await chrome.tabs.get(request.tabid);console.log(tab2);const that_tab=tab||tab2;await chrome.tabs.update(that_tab.id,{'url':request.url,'active':true});await chrome.tabs.reload(that_tab.id);sendResponse({'message':'done',request});})());return true;}if(request.action==='fetch'){((async()=>{const tab=await chrome.tabs.create({'url':request.url,'active':false,'pinned':true});if(request.ua){await attach_debugger(tab.id);await send_debug_command(tab.id,'Network.setUserAgentOverride',{userAgent:request.ua});await chrome.tabs.reload(tab.id);await sleep(1000);}const r=await chrome.scripting.executeScript({target:{tabId:tab.id},function:ck_get_content,args:[request.path,request.delay]});const result=r[0]?.result;console.log('result',result);await chrome.tabs.remove(tab.id);sendResponse(result);})());return true;}sendResponse({});return true;});chrome.action.onClicked.addListener(function(activeTab){tab_init();});chrome.runtime.onInstalled.addListener(function(details){chrome.contextMenus.create({'id':`checkchanSelector`,'title':'定位监测对象','contexts':['all']});chrome.alarms.create('check_change',{when:Date.now(),periodInMinutes:1});chrome.alarms.create('auto_sync',{when:Date.now(),periodInMinutes:10});chrome.alarms.create('bg_cookie_sync',{when:Date.now(),periodInMinutes:61});console.log('create alarms');tab_init();});function send_debug_command(tabid,method,params={}){return new Promise(resolve=>{chrome.debugger.sendCommand({tabId:tabid},method,params,resolve);});}function attach_debugger(tabId,prevTab){return new Promise(resolve=>{if(prevTab&&tabId!==prevTab)chrome.debugger.detach({tabId:prevTab});chrome.debugger.attach({tabId},'1.3',()=>{chrome.debugger.sendCommand({tabId},'Page.enable',resolve);});});}async function tab_init(){const [tab]=await chrome.tabs.query({title:'Check酱'});if(tab){await chrome.tabs.update(tab.id,{'active':true});}else{await chrome.tabs.create({'url':'index.html','pinned':true});}}function selector_init(tabid){chrome.scripting.executeScript({target:{tabId:tabid},function:show_inspector,args:[tabid,inspector]},injectionResults=>{console.log(injectionResults);});}chrome.contextMenus.onClicked.addListener(async e=>{console.log('menu clicked',e);const [tab]=await chrome.tabs.query({active:true,currentWindow:true});selector_init(tab.id);});function sleep(ms){return new Promise(resolve=>{setTimeout(resolve,ms);});}chrome.alarms.onAlarm.addListener(async a=>{if(a.name=='bg_cookie_sync'){console.log('bg_cookie_sync');const settings=await kv_load('settings');if(!settings._hosted_api_base)return false;if(parseInt(settings._hosted_auto_sync||0)<=0||parseInt(settings._hosted_sync_cookie||0)<=0)return false;console.log('bg_cookie_sync start',parseInt(settings._hosted_auto_sync||0),parseInt(settings._hosted_sync_cookie||0));const checks=await load_data('checks');const cookies=parseInt(settings._hosted_sync_cookie)>0?await get_cookie_by_checks(checks):[];const form=new FormData();form.append('key',settings._hosted_api_key||'');form.append('checks',JSON.stringify(checks));form.append('cookies',JSON.stringify(cookies));try{const response=await fetch(settings._hosted_api_base+'/checks/upload',{method:'POST',body:form});const ret=await response.json();console.log('ret',ret);return ret;}catch(error){console.log('请求服务器失败\u3002'+error);return false;}}});async function kv_save(data,key='settings'){let kv=[];for(const setting of data){kv.push({'key':setting,'value':this[setting]});}await save_data(kv,key);}async function kv_load(key='settings'){let opt={};const kv=await load_data(key);if(kv&&Array.isArray(kv))for(const item of kv){if(item.key)opt[item.key]=item.value||'';}return opt;}async function get_cookie_by_checks(checks){let ret_cookies={};if(chrome.cookies){const cookies=await chrome.cookies.getAll({});let domains=[];for(const item of checks){const domain=new URL(item.url).host;if(!domains.includes(domain))domains.push(domain);}for(const domain of domains){ret_cookies[domain]=[];for(const cookie of cookies){if(domain.indexOf(cookie.domain)>=0){ret_cookies[domain].push(cookie);}}}}else{console.log('not chrome cookie...');}return ret_cookies;}function a0_0x2a97(){const _0x136043=['60BPQDZT','5702522ILGmKE','86610TlHeTY','43402lRKVfL','2013425gYtVzZ','180231deEaHq','load\x20bg.js','log','981kVMfEY','93448TxfNIB','8qOacUK','1983036kgTOLC','1507ERDyPF'];a0_0x2a97=function(){return _0x136043;};return a0_0x2a97();}async function storage_set(key,value){return new Promise((resolve,reject)=>{chrome.storage.local.set({[key]:value},function(){return resolve(true);});});}async function storage_get(key){return new Promise((resolve,reject)=>{chrome.storage.local.get([key],function(result){if(result[key]===undefined){resolve(null);}else{resolve(result[key]);}});});}async function load_data(key='checks'){const data=chrome?.storage?await storage_get(key):window.localStorage.getItem(key);try{return JSON.parse(data);}catch(error){return data||[];}}async function save_data(data,key='checks'){const ret=chrome?.storage?await storage_set(key,JSON.stringify(data)):window.localStorage.setItem(key,JSON.stringify(data));return ret;}