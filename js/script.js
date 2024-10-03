const output = document.getElementById('output');
const userInput = document.getElementById('user-input');
const terminal = document.querySelector('.terminal');

const commands = ['help', 'about', 'education', 'skills', 'courses', 'projects', 'resume', 'clear'];

function typeWriter(text, index = 0, callback) {
    if (index < text.length) {
        const char = text.charAt(index);
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'syntax-output';
        output.appendChild(span);
        setTimeout(() => typeWriter(text, index + 1, callback), 10);
    } else if (callback) {
        callback();
    }
}

function loadContent(command) {
    fetch(`${command}.html`)
        .then(response => response.text())
        .then(data => {
            const cleanData = data.replace(/<[^>]*>?/gm, '').trim();
            const formattedData = cleanData.split('•').map(item => item.trim()).filter(Boolean);
            if (formattedData.length > 1) {
                typeWriter(formattedData.map(item => `• ${item}`).join('\n'));
            } else {
                typeWriter(cleanData);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            typeWriter('An error occurred while loading the content.');
        });
}

function displayErrorMessage(command) {
    const errorMessage = `
Error: Command not found
  at Terminal.executeCommand (terminal.js:42)
  at Terminal.processInput (terminal.js:28)
  at HTMLInputElement.handleKeyDown (script.js:53)

TypeError: '${command}' is not a valid command
    at Object.executeCommand (commands.js:15)
    at Terminal.processInput (terminal.js:30)
    at HTMLInputElement.handleKeyDown (script.js:53)

Available commands: ${commands.join(', ')}
Type 'help' for more information on each command.`;
    
    typeWriter(errorMessage);
}

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = userInput.value.toLowerCase().trim();
        const commandLine = document.createElement('div');
        commandLine.className = 'input-line';
        commandLine.innerHTML = `<span class="prompt">guest@anikdas:~$</span> <span class="syntax-command">${command}</span>`;
        output.appendChild(commandLine);
        
        if (command === 'clear') {
            output.innerHTML = '';
        } else if (command === 'resume') {
            const resumeLink = document.createElement('a');
            resumeLink.href = 'Anik Das Resume.pdf';
            resumeLink.target = '_blank';
            resumeLink.textContent = 'Click here to view my resume';
            resumeLink.className = 'resume-link';
            output.appendChild(resumeLink);
            output.appendChild(document.createElement('br'));
        } else if (commands.includes(command)) {
            if (command === 'help') {
                typeWriter('Available commands: ' + commands.join(', ') + '\n\nType any command to get more information.\nresume: Provides a link to view my full resume.');
            } else {
                loadContent(command);
            }
        } else {
            displayErrorMessage(command);
        }

        userInput.value = '';
        output.scrollTop = output.scrollHeight;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    userInput.focus();
    
    typeWriter("Welcome to Anik Das's portfolio. Type 'help' to see available commands.", 0, () => {
        // Remove the following lines:
        // const initialPrompt = document.createElement('div');
        // initialPrompt.className = 'input-line';
        // initialPrompt.innerHTML = '<span class="prompt">guest@anikdas:~$</span> ';
        // output.appendChild(initialPrompt);
    });
});

function updateClock() {
    const now = new Date();
    const istOffset = 330; // IST is UTC+5:30
    const localOffset = now.getTimezoneOffset();
    const istTime = new Date(now.getTime() + (istOffset + localOffset) * 60000);
    
    const clock = document.getElementById('hacker-clock');

    // Time
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const seconds = istTime.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timeString = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

    // Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateString = `${days[istTime.getDay()]}, ${months[istTime.getMonth()]} ${istTime.getDate()}, ${istTime.getFullYear()}`;

    // Year countdown
    const endOfYear = new Date(istTime.getFullYear(), 11, 31, 23, 59, 59);
    const timeLeft = endOfYear - istTime;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

    clock.innerHTML = `
        <div class="time">${timeString}</div>
        <div class="date">${dateString}</div>
        <div class="year-countdown">Year ends in: ${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s</div>
    `;
}

// Update clock every second
setInterval(updateClock, 1000);

// Initial call to display clock immediately
updateClock();