const { exec } = require('child_process');
const path = require('path');

function openTerminalAndRunCommand(command, directory, index, files) {
    const currentScript = files[index];
    console.log(`Ejecutando el archivo ${currentScript}`);

    const scriptPath = path.join(directory, currentScript);
    const cmd = `start cmd.exe /C "cd ${directory} && ${command} ${scriptPath}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al abrir la terminal: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(`Testing finalizado .... ${stdout}`);

        if (index + 1 < files.length) {
            openTerminalAndRunCommand(command, directory, index + 1, files);
        } else {
            console.log("¡Todos los archivos han sido ejecutados!");
        }
    });
}

const command = 'k6 run';
const directory = __dirname;
const files = ['load_test.js', 'stress_test.js', 'spyke_test.js'];

openTerminalAndRunCommand(command, directory, 0, files);
