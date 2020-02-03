# Real Data

rd = new RealData( { project:"RealData" } )

# Get Data
## Way 1
rd.data after using real data.

**Example**
rd.data.project
> "RealData"
## Way 2
rd.get( path )

**Example**
rd.get("/project")
> "Real Data"

# Set Data
## Way 1
rd.data after you can change real data as normal Java Script.

**Example**
rd.data.project = "RealData v1"

## Way 2 
#################################################### NOT WORKED
rd.set( path , data )


## CATCH Change  .on( path , fn )

## onChange

.on( "/path" , function( new_value ){

})


## onNewItemAdd

.on( "/list/+" , function( new_items : Array<any> , start:number = null ){

})


## onItemRemoved

.on( "/list/-" , function( removed_items: Array<any>, start:number, count: number,  ){

})

