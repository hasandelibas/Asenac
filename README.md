# Asenac
Js Front End View Engine

# Data Bind Rules
    Self
    Global
    Element
    Parent
    Keys

    $       $$      $$$
    Self    Keys    Global


    html.{
        <h1> Hello World </h1>
    }

    :: FOR_DATA : KEY_NAME

    :? IF STATEMENT

    :! ELSE IF

    :! ELSE

    -> GOTO OTHER PAGE

    // COMMENT

    - EVAL JS

    :# REPLACE WITH ID

    :> REPLACE WITH ALL SELECTOR

    :+ APPEND WITH ALL SELECTOR


    : title : div.title[title=title]> Title OBJ

# Create HTML Element

    > TEXT NODE

    div.class#id[attr=value]> INNER HTML TEXT

    div[@empty={{ 1==1 ? "" :"1" }}]> INNER HTML TEXT
