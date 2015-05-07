
---

# leaf.Util (static) #
## Description ##
Util has common DOM methods, like getById, new methods (getByClass) and fixes.

## Methods ##
| **Name** | **Arguments** | **Return** | **Description** |
|:---------|:--------------|:-----------|:----------------|
|getById|String or Array|Element or Array (depending on argument)|Search, on document, for element(s) with the specified id(s). If String, return element. If Array, return array. Null if no match|
|getByTag|String or Array|Array|Search, on document, for element(s) with the specified tagNames|
|getByClass|String or Array|Array|Search, on document, for element(s) with the specified classNames|
|purgeDOM|DOM Element or window or document|void|IE old versions does not destroy elements if they have any function attached to it. Use this method in place of any removeElement when you want that element to be removed and destroyed|