const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, '../temp');
if(!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir);
}

exports.runCode = (req,res) =>{
    const { language, code, input} = req.body;
    if(!language || !code){
        return res.status(400).json({error: 'Language and code is required'});
    }

    const inputFilePath = path.join(tempDir, 'input.txt');
    const codeFilePath = path.join(tempDir, 'code');
    const timeoutDuration = 5000;

    // Write input to a file if provided
    if (input) fs.writeFileSync(inputFilePath, input);

    let command = '';
    if (language === 'javascript') {
        command = `node -e "${code.replace(/"/g, '\\"')}" < "${inputFilePath}"`;
    } else if (language === 'python') {
        fs.writeFileSync(`${codeFilePath}.py`, code);
        command = `python3 "${codeFilePath}.py" < "${inputFilePath}"`;
    } else if (language === 'cpp') {
        fs.writeFileSync(`${codeFilePath}.cpp`, code);
        command = `g++ "${codeFilePath}.cpp" -o "${codeFilePath}" && "${codeFilePath}" < "${inputFilePath}"`;
    } else if (language === 'java') {
        fs.writeFileSync(`${codeFilePath}.java`, code);
        command = `javac "${codeFilePath}.java" && java -cp "${tempDir}" ${path.basename(codeFilePath)} < "${inputFilePath}"`;
    } else {
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    console.log(`Executing: ${command}`);
    const execProcess = exec(command, { timeout: timeoutDuration }, (error, stdout, stderr) => {
        try {
            // Cleanup temporary files except input.txt
            if (language === 'python' && fs.existsSync(`${codeFilePath}.py`)) {
                fs.unlinkSync(`${codeFilePath}.py`);
            } else if (language === 'cpp') {
                if (fs.existsSync(`${codeFilePath}.cpp`)) fs.unlinkSync(`${codeFilePath}.cpp`);
                if (fs.existsSync(codeFilePath)) fs.unlinkSync(codeFilePath);
            } else if (language === 'java') {
                if (fs.existsSync(`${codeFilePath}.java`)) fs.unlinkSync(`${codeFilePath}.java`);
                if (fs.existsSync(path.join(tempDir, 'code.class'))) fs.unlinkSync(path.join(tempDir, 'code.class'));
            }
            // Do not delete input.txt anymore
            // if (input && fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
        } catch (cleanupError) {
            console.error('Cleanup Error:', cleanupError.message);
        }

        if (error) {
            console.error('Execution Error:', stderr || error.message);
            return res.status(500).json({ error: stderr || error.message });
        }

        res.json({ output: stdout });
    });

    execProcess.on('timeout', () => {
        console.log('Code execution timed out.');
        res.status(408).json({ error: 'Code execution timed out.' });
        execProcess.kill();
    });

}