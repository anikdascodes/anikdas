const output = document.getElementById('output');
const userInput = document.getElementById('user-input');

const commands = ['help', 'about', 'education', 'skills', 'courses', 'projects', 'resume', 'clear'];

function typeWriter(text, index = 0) {
    if (index < text.length) {
        const char = text.charAt(index);
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'syntax-output';
        output.appendChild(span);
        setTimeout(() => typeWriter(text, index + 1), 10);
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

typeWriter("Welcome to Anik Das's portfolio. Type 'help' to see available commands.");

// Add this at the end of the file
document.addEventListener('DOMContentLoaded', () => {
    userInput.focus();
});