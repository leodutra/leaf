
---

# leaf.Object (static) #
## Description ##
Object prototype wraps methods for common operations. LEAF does not change the native Object prototype, since this could impact in other libs and works.

## Methods ##
| **Name** | **Arguments** | **Return** | **Description** |
|:---------|:--------------|:-----------|:----------------|
|extend|Object, Object|Object|Creates a object that uses the first passed object as prototype then extends it with the properties and methods of the second argument|