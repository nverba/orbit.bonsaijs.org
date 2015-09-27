ace.define("ace/mode/xquery",["require","exports","module","ace/worker/worker_client","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/xquery_highlight_rules","ace/mode/behaviour/xquery","ace/range"],function(e,t,n){var r=e("../worker/worker_client").WorkerClient,i=e("../lib/oop"),s=e("./text").Mode,o=e("../tokenizer").Tokenizer,u=e("./xquery_highlight_rules").XQueryHighlightRules,a=e("./behaviour/xquery").XQueryBehaviour,f=e("../range").Range,l=function(e){this.$tokenizer=new o((new u).getRules()),this.$behaviour=new a(e)};i.inherits(l,s),function(){this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=t.match(/\s*(?:then|else|return|[{\(]|<\w+>)\s*$/);return i&&(r+=n),r},this.checkOutdent=function(e,t,n){return/^\s+$/.test(t)?/^\s*[\}\)]/.test(n):!1},this.autoOutdent=function(e,t,n){var r=t.getLine(n),i=r.match(/^(\s*[\}\)])/);if(!i)return 0;var s=i[1].length,o=t.findMatchingBracket({row:n,column:s});if(!o||o.row==n)return 0;var u=this.$getIndent(t.getLine(o.row));t.replace(new f(n,0,n,s-1),u)},this.$getIndent=function(e){var t=e.match(/^(\s+)/);return t?t[1]:""},this.toggleCommentLines=function(e,t,n,r){var i,s,o=!0,u=/^\s*\(:(.*):\)/;for(i=n;i<=r;i++)if(!u.test(t.getLine(i))){o=!1;break}var a=new f(0,0,0,0);for(i=n;i<=r;i++)s=t.getLine(i),a.start.row=i,a.end.row=i,a.end.column=s.length,t.replace(a,o?s.match(u)[1]:"(:"+s+":)")},this.createWorker=function(e){this.$deltas=[];var t=new r(["ace"],"ace/mode/xquery_worker","XQueryWorker"),n=this;return e.getDocument().on("change",function(e){n.$deltas.push(e.data)}),t.attachToDocument(e.getDocument()),t.on("start",function(e){n.$deltas=[]}),t.on("error",function(t){e.setAnnotations([t.data])}),t.on("ok",function(t){e.clearAnnotations()}),t.on("highlight",function(t){var r=0,i=e.getLength()-1,s=t.data.lines,o=t.data.states;for(var u=0;u<n.$deltas.length;u++){var a=n.$deltas[u];if(a.action==="insertLines"){var f=a.lines.length;for(var u=0;u<f;u++)s.splice(a.range.start.row+u,0,undefined),o.splice(a.range.start.row+u,0,undefined)}else if(a.action==="insertText")e.getDocument().isNewLine(a.text)?(s.splice(a.range.end.row,0,undefined),o.splice(a.range.end.row,0,undefined)):(s[a.range.start.row]=undefined,o[a.range.start.row]=undefined);else if(a.action==="removeLines"){var l=a.lines.length;s.splice(a.range.start.row,l),o.splice(a.range.start.row,l)}else a.action==="removeText"&&(e.getDocument().isNewLine(a.text)?(s[a.range.start.row]=undefined,s.splice(a.range.end.row,1),o[a.range.start.row]=undefined,o.splice(a.range.end.row,1)):(s[a.range.start.row]=undefined,o[a.range.start.row]=undefined))}e.bgTokenizer.lines=s,e.bgTokenizer.states=o,e.bgTokenizer.fireUpdateEvent(r,i)}),t}}.call(l.prototype),t.Mode=l}),ace.define("ace/mode/xquery_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){var e=this.createKeywordMapper({keyword:"after|ancestor|ancestor-or-self|and|as|ascending|attribute|before|case|cast|castable|child|collation|comment|copy|count|declare|default|delete|descendant|descendant-or-self|descending|div|document|document-node|element|else|empty|empty-sequence|end|eq|every|except|first|following|following-sibling|for|function|ge|group|gt|idiv|if|import|insert|instance|intersect|into|is|item|last|le|let|lt|mod|modify|module|namespace|namespace-node|ne|node|only|or|order|ordered|parent|preceding|preceding-sibling|processing-instruction|rename|replace|return|satisfies|schema-attribute|schema-element|self|some|stable|start|switch|text|to|treat|try|typeswitch|union|unordered|validate|where|with|xquery|contains|paragraphs|sentences|times|words|by|collectionreturn|variable|version|option|when|encoding|toswitch|catch|tumbling|sliding|window|at|using|stemming|collection|schema|while|on|nodes|index|external|then|in|updating|value|of|containsbreak|loop|continue|exit|returning|append|json|position"},"identifier");this.$rules={start:[{token:"text",regex:"<\\!\\[CDATA\\[",next:"cdata"},{token:"xml-pe",regex:"<\\?.*?\\?>"},{token:"comment",regex:"<\\!--",next:"comment"},{token:"comment",regex:"\\(:",next:"comment"},{token:"text",regex:"<\\/?",next:"tag"},{token:"constant",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"variable",regex:"\\$[a-zA-Z_][a-zA-Z0-9_\\-:]*\\b"},{token:"string",regex:'".*?"'},{token:"string",regex:"'.*?'"},{token:"text",regex:"\\s+"},{token:"support.function",regex:"\\w[\\w+_\\-:]+(?=\\()"},{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\*|=|<|>|\\-|\\+"},{token:"lparen",regex:"[[({]"},{token:"rparen",regex:"[\\])}]"}],tag:[{token:"text",regex:">",next:"start"},{token:"meta.tag",regex:"[-_a-zA-Z0-9:]+"},{token:"text",regex:"\\s+"},{token:"string",regex:'".*?"'},{token:"string",regex:"'.*?'"}],cdata:[{token:"comment",regex:"\\]\\]>",next:"start"},{token:"comment",regex:"\\s+"},{token:"comment",regex:"(?:[^\\]]|\\](?!\\]>))+"}],comment:[{token:"comment",regex:".*?-->",next:"start"},{token:"comment",regex:".*:\\)",next:"start"},{token:"comment",regex:".+"}]}};r.inherits(s,i),t.XQueryHighlightRules=s}),ace.define("ace/mode/behaviour/xquery",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/mode/behaviour/cstyle"],function(e,t,n){var r=e("../../lib/oop"),i=e("../behaviour").Behaviour,s=e("./cstyle").CstyleBehaviour,o=function(e){this.inherit(s,["braces","parens","string_dquotes"]),this.parent=e};r.inherits(o,i),t.XQueryBehaviour=o}),ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour"],function(e,t,n){var r=e("../../lib/oop"),i=e("../behaviour").Behaviour,s=function(){this.add("braces","insertion",function(e,t,n,r,i){if(i=="{"){var s=n.getSelectionRange(),o=r.doc.getTextRange(s);return o!==""?{text:"{"+o+"}",selection:!1}:{text:"{}",selection:[1,1]}}if(i=="}"){var u=n.getCursorPosition(),a=r.doc.getLine(u.row),f=a.substring(u.column,u.column+1);if(f=="}"){var l=r.$findOpeningBracket("}",{column:u.column+1,row:u.row});if(l!==null)return{text:"",selection:[1,1]}}}else if(i=="\n"){var u=n.getCursorPosition(),a=r.doc.getLine(u.row),f=a.substring(u.column,u.column+1);if(f=="}"){var c=r.findMatchingBracket({row:u.row,column:u.column+1});if(!c)return null;var h=this.getNextLineIndent(e,a.substring(0,a.length-1),r.getTabString()),p=this.$getIndent(r.doc.getLine(c.row));return{text:"\n"+h+"\n"+p,selection:[1,h.length,1,h.length]}}}}),this.add("braces","deletion",function(e,t,n,r,i){var s=r.doc.getTextRange(i);if(!i.isMultiLine()&&s=="{"){var o=r.doc.getLine(i.start.row),u=o.substring(i.end.column,i.end.column+1);if(u=="}")return i.end.column++,i}}),this.add("parens","insertion",function(e,t,n,r,i){if(i=="("){var s=n.getSelectionRange(),o=r.doc.getTextRange(s);return o!==""?{text:"("+o+")",selection:!1}:{text:"()",selection:[1,1]}}if(i==")"){var u=n.getCursorPosition(),a=r.doc.getLine(u.row),f=a.substring(u.column,u.column+1);if(f==")"){var l=r.$findOpeningBracket(")",{column:u.column+1,row:u.row});if(l!==null)return{text:"",selection:[1,1]}}}}),this.add("parens","deletion",function(e,t,n,r,i){var s=r.doc.getTextRange(i);if(!i.isMultiLine()&&s=="("){var o=r.doc.getLine(i.start.row),u=o.substring(i.start.column+1,i.start.column+2);if(u==")")return i.end.column++,i}}),this.add("brackets","insertion",function(e,t,n,r,i){if(i=="["){var s=n.getSelectionRange(),o=r.doc.getTextRange(s);return o!==""?{text:"["+o+"]",selection:!1}:{text:"[]",selection:[1,1]}}if(i=="]"){var u=n.getCursorPosition(),a=r.doc.getLine(u.row),f=a.substring(u.column,u.column+1);if(f=="]"){var l=r.$findOpeningBracket("]",{column:u.column+1,row:u.row});if(l!==null)return{text:"",selection:[1,1]}}}}),this.add("brackets","deletion",function(e,t,n,r,i){var s=r.doc.getTextRange(i);if(!i.isMultiLine()&&s=="["){var o=r.doc.getLine(i.start.row),u=o.substring(i.start.column+1,i.start.column+2);if(u=="]")return i.end.column++,i}}),this.add("string_dquotes","insertion",function(e,t,n,r,i){if(i=='"'||i=="'"){var s=i,o=n.getSelectionRange(),u=r.doc.getTextRange(o);if(u!=="")return{text:s+u+s,selection:!1};var a=n.getCursorPosition(),f=r.doc.getLine(a.row),l=f.substring(a.column-1,a.column);if(l=="\\")return null;var c=r.getTokens(o.start.row),h=0,p,d=-1;for(var v=0;v<c.length;v++){p=c[v],p.type=="string"?d=-1:d<0&&(d=p.value.indexOf(s));if(p.value.length+h>o.start.column)break;h+=c[v].value.length}if(!p||d<0&&p.type!=="comment"&&(p.type!=="string"||o.start.column!==p.value.length+h-1&&p.value.lastIndexOf(s)===p.value.length-1))return{text:s+s,selection:[1,1]};if(p&&p.type==="string"){var m=f.substring(a.column,a.column+1);if(m==s)return{text:"",selection:[1,1]}}}}),this.add("string_dquotes","deletion",function(e,t,n,r,i){var s=r.doc.getTextRange(i);if(!i.isMultiLine()&&(s=='"'||s=="'")){var o=r.doc.getLine(i.start.row),u=o.substring(i.start.column+1,i.start.column+2);if(u=='"')return i.end.column++,i}})};r.inherits(s,i),t.CstyleBehaviour=s})