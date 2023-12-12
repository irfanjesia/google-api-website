// API Data
const data = [];

// Preview url in frame
function previewUrl (url, target) {
  var div = document.getElementById (target);
  div.innerHTML =
    '<iframe class="w-100 h-100" frameborder="0" src="' + url + '" />';
}

// Get data to show in table
function loadData (keyword) {
  // Wait for searchdata to complete ~ async function
  searchData (keyword).then (() => {
    // Reset table data
    $ ('#dataTable tbody').empty ();

    // Add new data
    data.forEach (item => {
      $ ('#dataTable tbody').append (
        `<tr><td onclick="previewUrl('${item.url}','frame')">${item.title}</td><td onclick="previewUrl('${item.url}','frame')">${item.url}</td></tr>`
      );
    });
  });
}

// Expand
const dragBar = document.getElementById ('drag-bar');
const topPane = document.getElementById ('top-pane');
const bottomPane = document.getElementById ('bottom-pane');
let isDragging = false;

dragBar.addEventListener ('mousedown', e => {
  isDragging = true;
  document.addEventListener ('mousemove', handleMouseMove);
  document.addEventListener ('mouseup', () => {
    isDragging = false;
    document.removeEventListener ('mousemove', handleMouseMove);
  });
});

function handleMouseMove (e) {
  if (isDragging) {
    const containerRect = document
      .getElementById ('content')
      .getBoundingClientRect ();
    const topPaneHeight = e.clientY - containerRect.top;
    topPane.style.height = `${topPaneHeight}px`;
  }
}

// Sort table
function sortTable (n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById ('dataTable');
  switching = true;

  // Set sort to ascending:
  dir = 'asc';

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      // Compare
      x = rows[i].getElementsByTagName ('TD')[n];
      y = rows[i + 1].getElementsByTagName ('TD')[n];

      if (dir == 'asc') {
        if (x.innerHTML.toLowerCase () > y.innerHTML.toLowerCase ()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == 'desc') {
        if (x.innerHTML.toLowerCase () < y.innerHTML.toLowerCase ()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore (rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      // If there's no switching and sort is "asc", set the direction to "desc" and loop
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
}

const apiKey = 'AIzaSyBrFyRbDtgKEDc9NCO5cmvaBfr0JSkNeDw';
const cx = 'c15b2f0921c764a73';

async function searchData (query) {
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&q=${query}&cx=${cx}`;

  try {
    const response = await fetch (apiUrl);
    if (!response.ok) {
      throw new Error (`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json ();
    storeResults (data.items);
  } catch (error) {
    console.error ('Error fetching search results:', error);
  }
}

function storeResults (results) {
  data.length = 0;

  for (let i = 0; i < 6; i++) {
    const result = results[i];
    data.push ({title: result.title, url: result.link});
  }
}
