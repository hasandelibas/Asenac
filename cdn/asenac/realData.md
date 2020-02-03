# Real Data

**public**

.data : any
Stored Data

.on( path , function( args ) )
Add Trigger on data change, remove, add new ...

.call( path  , arg )
Call From other client or server. Call change variables with unvisible method.

**private**

.getPathInfo( path ) : { path , index, count , type, data }
path to path object

.trigger( path , arg )
Self Call from .data on change, send call request to server or other clients

.setUp( path )
change path to Proxy

.getItem(path)
get real item 

.getItemWithParent( path ) : { self , key }
return self and key item

.getItemWithParentAndDefine( path ) : { self , key } 
_using from Call Request_
return self and key, if item not exist define


# Work 
