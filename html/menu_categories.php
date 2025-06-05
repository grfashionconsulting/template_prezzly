<?php
  require("../includes/common.php");

  $parent = (isset($_GET["parent"])?intval($_GET["parent"]):0);

  $sql2 = "SELECT * FROM `".$config_databaseTablePrefix."categories_hierarchy` WHERE parent='".$parent."'";

  if (database_querySelect($sql2,$rows2))
  {
    foreach($rows2 as $category)
    {
      $sql3 = "SELECT id FROM `".$config_databaseTablePrefix."categories_hierarchy` WHERE parent='".$category["id"]."' LIMIT 1";

      if (database_querySelect($sql3,$rows3))
      {
        print "<li class='has-dropdown' onClick='JavaScript:menu_loadCat(".$category["id"].");'>";

        print "<a href='#'>".$category["name"]."</a>";

        print "<ul id='menu_cat".$category["id"]."' class='dropdown'>";

        print "<li><a href='#'>&nbsp;</a><div class='preloader'></div></li>";

        print "</ul>";

        print "</li>";
      }
      else
      {
        $categoryHierarchyArray = tapestry_categoryHierarchyArray(array($category["id"]));

        $itemHREF = tapestry_indexHREF("category",tapestry_hyphenate($categoryHierarchyArray[$category["id"]]));

        print "<li>";

        print "<a href='".$itemHREF."'>".$category["name"]."</a>";

        print "</li>";
      }
    }
  }
?>