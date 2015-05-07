
---

# leaf.Array (static) #
## Description ##
Array prototype wraps methods for common array operations. LEAF does not change the native Array prototype, since this could impact in other libs and works.

## Methods ##
| **Name** | **Arguments** | **Return** | **Description** |
|:---------|:--------------|:-----------|:----------------|
|each|Array, Function|void|Calls the function to handle each array item. The function will receive as argument: item, index; and any "this" inside function will be a pointer to the iterated array|