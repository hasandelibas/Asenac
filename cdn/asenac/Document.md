# RealData

constructor ( data:any )

**Variables**
.data   : It is Proxy data, you can detect changes.
**Functions**
.call ( path:string, data:any )
You can change real data at using path and data

.callQueue( Array<> )
Change real data with array.

.on( path:string, fn(data,index,count) )
Detect on change of variable. After Change

.get(path) 
Return path data



WORKING SHEMA

T:: Trigger, C:: Call, O:: On

# DEFINE DATA
T:: "/path/define" , data
C:: "/path/define" , data

O:: "/path/define" , data

# ARRAY ADD
T:: "/list/+(index)-(count)", [datas]
C:: "/list/+(index)-(count)", [datas]   -> insert count
C:: "/list/+(index)"        , [datas]   -> insert
C:: "/list/+"               , [datas]   -> add last

O:: "/list/+" , data, index

when index == null add new data at last

# ARRAY REMOVE
T:: "/list/-(index)+(count)"
C:: "/list/-(index)+(count)"
C:: "/list/-(index)"          -> remove one from index
C:: "/list/-"                 -> remove last one
O:: "/list/-" , [datas], index, count