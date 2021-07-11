# vaccine-notifier

[![top language](https://img.shields.io/github/languages/top/prakhil-tp/vaccine-notifier)](https://github.com/prakhil-tp/vaccine-notifier/search?l=javascript)
[![tag](https://img.shields.io/github/v/tag/prakhil-tp/vaccine-notifier)](https://github.com/prakhil-tp/vaccine-notifier/tags)
[![last commit](https://img.shields.io/github/last-commit/prakhil-tp/vaccine-notifier)](https://github.com/Prakhil-tp/vaccine-notifier/commits/master)

It gathers information about the available vaccination centers and gives us push notification on signal app

## Tldr;

vaccine-notifier is a script, which gathers information regularly from an HTTP endpoint and sends a relevant message to the configured signal-app recipient.

Things we're going to discuss

    - Setting up the environment
    - Configure signal recipient
    - Setup the cron job

Remember, you need a remote machine: As the script needs to run regularly.

## How to use

The workflow of the script will be initiated by the `cron` job. It triggers the `run.sh` executable, which runs the `node` script.

### Setting up the environment

Make sure you have the `node.js` installed on your system. It is what interpret the actual logic.
Now, we can set up our code in the machine. for that just clone the repository and install necessary packages: follow the below command.

``` sh
git clone https://github.com/Prakhil-tp/vaccine-notifier.git
cd vaccine-notifier
yarn install
```
If you don't have `yarn` in your system, it's okay to use `npm` instead.

#### verify file permissions

You should verify the permissions of the script files. If those files doesn't have execute permission, they won't be able to run our scripts. This can be done using `ll` command in your shell.
The output would be look like this.

``` sh
$ ll

-rw-r--r--. 1 prakhil prakhil  487 Jul  6 09:59 config.json
-rw-r--r--. 1 prakhil prakhil 2.9K Jul  6 10:03 index.js
drwxr-xr-x. 1 prakhil prakhil 1.1K Jul  2 22:31 node_modules
-rw-r--r--. 1 prakhil prakhil  230 Jul  6 09:59 package.json
-rw-r--r--. 1 prakhil prakhil  127 Jul  2 23:45 README.md
-rwxr-xr-x. 1 prakhil prakhil  169 Jul  3 19:16 run.sh
-rwxr--r--. 1 prakhil prakhil   82 Jun 13 10:00 script.sh
-rw-r--r--. 1 prakhil prakhil  15K Jul  6 09:59 yarn.lock

```
### Configure signal recipient

As you know, this script is going to inform you through the help of signal-app. Therefore, you must have signal-client installed and configured on your machine.

Someone has already made a `signal-cli` for us: check this repo out https://github.com/AsamK/signal-cli and install the CLI and follow the usage as well.

Now, let's replace the configured values on the `script.sh` file. You'll be able to add phone numbers of the sender and receiver on the file. 

### Set up the cron job

So far, we configured our code base and signal-cli. The one that pending is regular script invocation.
Before get out hands dirty, let us test the code is working or not by running the `./run.sh` command on your terminal. If it all looks good, go ahead to set up the cron.

`crontab -e` command let you open the crontable, this is where we keep our cron entries.

Let's run our script every 5 minutes: use the following syntax add the entry on the cron table.

``` sh
*/5**** /path/to/run.sh >> /tmp/vaccine-notifier.log
```
If you want to know more about cron job, check out [my article here](https://dev.to/prakhil_tp/cron-job-for-node-scripts-1fa6)

     

