
---

# leaf.ElementHandler #
## Description ##
Handles HTML Elements fixing compatibility problems. It's a real JavaScript prototype, so will save memory. The ElementHandler provides lots of methods to ease style control and elements manipulation with an amazing performance.

## Methods ##
| **Name** | **Arguments** | **Return** | **Description** |
|:---------|:--------------|:-----------|:----------------|
|ElementHandler (constructor)|element:HTMLElement or String(id)|void|  |
|setElement|element:HTMLElement or String(id)|void|  |
|getElement|void|HTMLElement|  |
|getStyle|void|HTMLStyleObject|  |
|addListener|EventType, Function|void|Attempt to use "element.addEventListener". If no success, fixes IE removeEvent problem (removeEvent does not remove using native method)|
|removeListener|EventType, Function|void|Attempt to use "element.removeEventListener". If no success, fixes IE removeEvent problem (removeEvent does not remove using native method. Fix will work only if the listener was attached using LEAF "addListener")|
|dispatchEvent|EventType|void|Dispatch an event call (cross-browser)|
|addClass|Array or String|void|  |
|removeClass|Array or String|void|  |
|setPosition|top:CSSValue, right:CSSValue, bottom:CSSValue, left:CSSValue, type:CSSValue|void|  |
|getPosition|void|{top:CSSValue, right:CSSValue, bottom:CSSValue, left:CSSValue, type:CSSValue}|  |
|setXY|x:CSSValue, y:CSSValue|void|  |
|getXY|void|{x:CSSValue, y:CSSValue}|  |
|invertXY|x:boolean, y:boolean|void|  |
|getOffset|void|{x:Number, y:Number, width:Number, height:Number, parent:Node}|  |

**More soon...**