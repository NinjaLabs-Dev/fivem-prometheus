const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const env = process.env;
const app = express();
const axios = require("axios");
const serverIp = env.SERVER_IP;
const serverShortcode = env.SERVER_SHORTCODE;

// const { Octokit } = require("octokit");
// const octokit = new Octokit({
// 	auth: env.GITHUB_TOKEN
// });
// let curTxVersion = "0";

app.get("/", (req, res) => {
	res.type('text/plain');

	axios.get(`http://${serverIp}/players.json`)
		.then(data => {
			let playerNames = data.data.map(p => p.name);
			let pings = data.data.map(p => p.ping);

			let pingTotal = 0;
			let pingAverage = 0;
			let pingLow = 0;
			let pingHigh = 0;

			pings.forEach(p => {
				pingTotal += p;
			});


			pingAverage = Math.round(pingTotal / pings.length);
			pingLow = Math.round(Math.min(...pings));
			pingHigh = Math.round(Math.max(...pings));

			let response = [
				`# HELP fivem_player_pings_average The average ping of the players on the server`,
				`fivem_player_pings_average{server="${serverShortcode}"} ${pingAverage}`,
				`# HELP fivem_player_pings_low The lowest ping of the players on the server`,
				`fivem_player_pings_low{server="${serverShortcode}"} ${pingLow}`,
				`# HELP fivem_player_pings_high The highest ping of the players on the server`,
				`fivem_player_pings_high{server="${serverShortcode}"} ${pingHigh}`,
				`# HELP fivem_players_names The names of the players on the server`,
				`# TYPE fivem_players_names gauge`,
			]

			playerNames.forEach(p => {
				response.push(`fivem_players_names{server="${serverShortcode}",name="${p}"} 1`);
			});

			return res.send(response.join("\n")).status(200);
		}).catch(err => {
		return res.send(err.response).status(500);
	})
});

// getTxVersion();
// setTimeout(() => {
// 	getTxVersion();
// }, 15 * 60 * 1000);
// async function getTxVersion() {
// 	await octokit.request('GET /repos/tabarra/txAdmin/releases/latest', {
// 		owner: 'OWNER',
// 		repo: 'REPO',
// 		headers: {
// 			'X-GitHub-Api-Version': '2022-11-28'
// 		}
// 	}).then(data => {
// 		curTxVersion = data.data.tag_name;
// 	})
// }

app.listen(env.PORT, () => {
	console.log(`Server is running on port ${env.PORT}`);
});
