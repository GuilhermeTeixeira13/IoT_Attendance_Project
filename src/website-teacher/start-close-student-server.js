// Check the server state when the page loads
window.addEventListener('load', checkServerState);

function toggleServer(state) {
    const errorDiv = document.querySelector('#error-msg');
    const startBtn = document.getElementById('start-server');
    const closeBtn = document.getElementById('close-server');
    const classLabel= document.getElementById('class-label');
    const className = document.getElementById('class-name');
    
    // Update the server state
    updateServerState(state);

    // Update the button styles
    startBtn.style.display = (state === 'running') ? 'none' : 'block';
    closeBtn.style.display = (state === 'running') ? 'block' : 'none';
    errorDiv.style.display = (state === 'running') ? 'none' : 'block';
    className.readOnly = (state === 'running') ? true : false;
    checkServerClassName().then(serverClassName => {
        className.value = (state === 'stopped') ? '' : serverClassName;
    });
    classLabel.innerHTML = (state === 'running') ? 'Class currently running:' : 'Enter class name:';
}

function startStudentServer() {
    const errorDiv = document.querySelector('#error-msg');
    if (emptyClassName()) {
        errorDiv.innerHTML = "The class name can't be empty!";
    } else {
        errorDiv.innerHTML = "";
        updateServerClassName(document.getElementById('class-name').value);
        // Make an AJAX request to start the server
        fetch('/start-new-server')
            .then(response => toggleServer('running'))
            .catch(error => console.error('Error starting server:', error));
        }
}

function stopStudentServer() {
    // Make an AJAX request to stop the server
    fetch('/stop-server')
    .then(response => toggleServer('stopped'))
    .catch(error => console.error('Error stopping server:', error));
}

function checkServerState() {
    fetch('/server-state')
    .then(response => response.text())
    .then(state => toggleServer(state));
}

function checkServerClassName() {
  return fetch('/server-class')
    .then(response => response.text())
    .then(serverClassName => {
        console.log('Server class name:', serverClassName);
      return serverClassName;
    });
}

function updateServerState(state) {
    fetch('/update-server-state', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
    });
}

function updateServerClassName(className) {
    fetch('/update-server-class-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className }),
    });
}

function emptyClassName() {
    return document.getElementById("class-name").value.trim() === "";
}
