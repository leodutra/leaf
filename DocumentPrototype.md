
---

# leaf.Document (static) #
## Description ##
Document prototype fixes problems with the native document object. LEAF does not change the native prototype, since this could impact in other libs and works.

## Methods ##
| **Name** | **Arguments** | **Return** | **Description** |
|:---------|:--------------|:-----------|:----------------|
|addListener|EventType, Function|void|Attempt to use "document.addEventListener". If no success, fixes IE removeEvent problem (removeEvent does not remove using native method)|
|removeListener|EventType, Function|void|Attempt to use "document.removeEventListener". If no success, fixes IE removeEvent problem (removeEvent does not remove using native method. Fix will work only if the listener was attached using LEAF "addListener")|
tive method)
|dispatchEvent|EventType|void|Dispatch an event call (cross-browser)|