
---

# leaf.Ajax (static) #
## Description ##
Ajax prototype is not complete yet. Now it has only a fix for the "XMLHttpRequest (XHR) problem".

## Methods ##
| **Name** | **Arguments** | **Return** | **Description** |
|:---------|:--------------|:-----------|:----------------|
|createRequester|void|XMLHttpRequest|Fixes the creation of XMLHttpRequest object, since IE old versions use ActiveX on XHR creation. This function try to create using the W3C native XMLHttpRequest prototype. If not possible, will create using the newest version avaiable to ActiveX (trying from MSXML2.XMLHTTP.6.0 to older). The decision about native XHR and ActiveX is took just on loading time (delay is less than 1 milisecond)|