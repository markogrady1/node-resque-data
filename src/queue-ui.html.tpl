<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><% title %></title>
  <!--<link rel="stylesheet" type="text/css" href="./swagger-ui.css" >-->

  <style>
    html
    {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
        box-sizing: inherit;
    }

    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>

<body>

<div class="queue-table"></div>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="./ajax-req.js"> </script>
<script src="./queue-ui-init.js"> </script>
</body>
</html>