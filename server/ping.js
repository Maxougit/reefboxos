import { exec } from "child_process";
import os from "os";

const pingCommand = os.platform() === "win32" ? `ping -n 1` : `ping -c 1`;

const getPingLatency = (ip) => {
  return new Promise((resolve, reject) => {
    exec(`${pingCommand} ${ip}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur d'exécution de ping: ${error}`);
        reject(`Erreur de ping: ${error}`);
        return;
      }

      const lines = stdout.split("\n");
      // Finds the line containing 'time='
      const pingLine = lines.find(
        (line) => line.includes("time=") || line.includes("time<")
      );
      if (pingLine) {
        const match = pingLine.match(/time=([^ ]*)ms/);
        if (match && match[1]) {
          resolve(match[1]); // Return the latency time in ms
        } else {
          reject("Latence non trouvée");
        }
      } else {
        console.log(lines);
        reject("Réponse de ping non standard ou absence de réponse");
      }
      return;
    });
  });
};

export { getPingLatency };
