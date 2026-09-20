const {spawnSync}=require("node:child_process");
const url=new URL(process.env.DATABASE_URL);
if(url.hostname!=="127.0.0.1"||url.port!=="5437"||url.pathname!=="/sb2_dev")throw new Error("Only isolated development backup is allowed");
const output="/mnt/sb2dev/backups/pre-jwt-"+Date.now()+".dump";
const result=spawnSync("/usr/lib/postgresql/18/bin/pg_dump",["-h",url.hostname,"-p",url.port,"-U",decodeURIComponent(url.username),"-d","sb2_dev","-Fc","-f",output],{env:{...process.env,PGPASSWORD:decodeURIComponent(url.password)},stdio:["ignore","ignore","pipe"]});
if(result.status!==0)throw new Error("Backup failed: "+result.stderr.toString());
require("node:fs").chmodSync(output,0o600);
console.log("Development backup saved: "+output);
