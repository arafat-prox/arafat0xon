var shell = $(".shell")
  .resizable({
    minHeight: 220,
    minWidth: 450,
  })
  .draggable({
    handle: "> .status-bar .title",
  });

var fs = {
  projects: {
    "E-commerce Backend": "https://github.com/mrx-arafat/e-commmerce-backend",
    "Simple Python Web-Crawler":
      "https://github.com/mrx-arafat/KingBOB-WebCrawler",
    "RSA For CSE429": "https://github.com/mrx-arafat/RSA-for-CSE429",
    "Saved-Wifi-Passwords Grabber":
      "https://github.com/mrx-arafat/Grab-Saved-Wifi-Passwords",
    "Decrypt Chrome Passwords":
      "https://github.com/mrx-arafat/decrypt-chrome-passwords",
    "Web Bypassing 403 (dos2unix)":
      "https://github.com/mrx-arafat/Web-403-Bypass-dos2unix",
    other: {
      "memoir.txt":
        "co-founder of VC-backed tech enabled chronic pain platform",
      "rewind.txt":
        "lead product, bridging the digital & analogue in diabetes reversal",
      "athenahealth.txt":
        "my first job. started as a data scientist, ended up a TPM",
      "brighthealth.txt": "PM building virtual pharma offering",
      "misc-work": {
        "tachy.txt": "investing at the intersection of health & social",
        "advisor-roles.txt": "UCSF health hub, Affect",
      },
    },
  },
};

var path = [];
var cwd = fs;
function restore_cwd(fs, path) {
  path = path.slice();
  while (path.length) {
    var dir_name = path.shift();
    if (!is_dir(fs[dir_name])) {
      throw new Error(
        "Internal Error Invalid directory " +
          $.terminal.escape_brackets(dir_name)
      );
    }
    fs = fs[dir_name];
  }
  return fs;
}
function is_dir(obj) {
  return typeof obj === "object";
}
function is_file(obj) {
  return typeof obj === "string";
}
var commands = {
  cd: function (dir) {
    this.pause();
    if (dir === "/") {
      path = [];
      cwd = restore_cwd(fs, path);
    } else if (dir === "..") {
      if (path.length) {
        path.pop(); // remove from end
        cwd = restore_cwd(fs, path);
      }
    } else if (dir === "../") {
      if (path.length) {
        path.pop();
        cwd = restore_cwd(fs, path);
      }
    } else if (dir.match(/\//)) {
      var p = dir.replace(/\/$/, "").split("/").filter(Boolean);
      if (dir[0] !== "/") {
        p = path.concat(p);
      }
      cwd = restore_cwd(fs, p);
      path = p;
    } else if (!is_dir(cwd[dir])) {
      this.error($.terminal.escape_brackets(dir) + " is not a directory");
    } else {
      cwd = cwd[dir];
      path.push(dir);
    }
    this.resume();
  },
  whoami: function () {
    this.echo("\nOh hi there!");
    this.echo(
      "I'm Arafat, a cybersecurity researcher and junior penetration tester."
    );
    this.echo(
      "I specialize in web application security, penetration testing, and cybersecurity research."
    );
    this.echo("");
    this.echo(
      "I have a solid background in various domains of cybersecurity including web penetration, networking, digital forensics, and OSINT."
    );
    this.echo(
      "I have successfully organized international and national cybersecurity events, contributing significantly to the cybersecurity community."
    );
    this.echo("");
  },
  ls: function () {
    if (!is_dir(cwd)) {
      throw new Error("Internal Error Invalid directory");
    }
    var dir = Object.keys(cwd).map(function (key) {
      if (is_dir(cwd[key])) {
        return key + "/";
      }
      return key;
    });
    this.echo(dir.join("\n"));
  },
  cat: function (file) {
    if (!is_file(cwd[file])) {
      this.error($.terminal.escape_brackets(file) + " ain't here");
    } else {
      this.echo(cwd[file]);
    }
  },
  help: function () {
    showHelp(this);
    if (ga != undefined) ga("send", "event", "help");
  },
  clear: function () {
    this.clear();
    if (ga != undefined) ga("send", "event", "clear");
  },
  resume: function () {
    this.echo(
      "\t[[b;#aaa;]Junior Penetration Tester & Operational Lead]      Various Roles      '20-pres"
    );
    this.echo(
      "\t[[b;#aaa;]President]                            MIST Cyber Security Club      '23-'24"
    );
    this.echo(
      "\t[[b;#aaa;]Event Organizer]                      MIST Leetcon 2023: HackMeIfYouCan      '23"
    );
    this.echo(
      "\t[[b;#aaa;]Web Developer (Part-Time)]            NITRO9      '21"
    );
  },
  contact: function () {
    this.echo("");
    this.echo(
      "<strong><a href='https://www.linkedin.com/in/e4rafat/' style='color:red;'>LinkedIn</a></strong>",
      { raw: true }
    );
    this.echo(
      "<strong><a href='mailto:e4rafat@gmail.com' style='color:red;'>Email</a></strong>",
      { raw: true }
    );
    this.echo("");
    if (ga != undefined) ga("send", "event", "contact");
  },
  su: function (user) {
    this.echo("Nice try, [[b;#aaa;]" + user + "]! But not happening.");
    if (ga != undefined) ga("send", "event", "su", "user", user);
  },
  sudo: function () {
    this.echo("oooh careful there!?");
    if (ga != undefined) ga("send", "event", "sudo");
  },
  credits: function () {
    this.echo(
      "Built with <a href='http://terminal.jcubic.pl/' target='_blank'>jQuery Terminal</a> plugin.<br/><br/> CMD & design info from <strong><a href='https://codepen.io/jcubic/pen/WZvYGj'>Jakub T. Jankiewicz</a></strong> and <strong><a href='https://www.arafat.com/chandrabhavanasi.com'>Chandra Bhavanasi</a></strong><br/><br/>",
      { raw: true }
    );
    if (ga != undefined) ga("send", "event", "about");
  },
};
function completion(string, callback) {
  var command = this.get_command();
  var cmd = $.terminal.parse_command(command);
  function dirs(cwd) {
    return Object.keys(cwd)
      .filter(function (key) {
        return is_dir(cwd[key]);
      })
      .map(function (dir) {
        return dir + "/";
      });
  }
  if (cmd.name === "ls") {
    callback([]);
  } else if (cmd.name === "cd") {
    var p = string.split("/").filter(Boolean);
    if (p.length === 1) {
      if (string[0] === "/") {
        callback(dirs(fs));
      } else {
        callback(dirs(cwd));
      }
    } else {
      if (string[0] !== "/") {
        p = path.concat(p);
      }
      if (string[string.length - 1] !== "/") {
        p.pop();
      }
      var prefix = string.replace(/\/[^/]*$/, "");
      callback(
        dirs(restore_cwd(fs, p)).map(function (dir) {
          return prefix + "/" + dir;
        })
      );
    }
  } else if (cmd.name === "cat") {
    var files = Object.keys(cwd).filter(function (key) {
      return is_file(cwd[key]);
    });
    callback(files);
  } else {
    callback(Object.keys(commands));
  }
}
var term = $(".content").terminal(commands, {
  prompt() {
    if (path.length == 0) {
      return `┌──(${color("green", "K1ngBOB@arafat")})~[${color("blue", "/")}]
└─\$ `;
    } else {
      return `┌──(${color("green", "K1ngBOB@arafat")})~[${color(
        "blue",
        path.toString().replace(",", "/")
      )}]
└─\$ `;
    }
  },
  completion: completion,
  greetings:
    "    _     ____    _ _____    _  _____                       \n" +
    "   / \\   / _  |  / |___  |  / \\|_   ___  _____   ___   __ _ \n" +
    "  / _ \\ | (_| | / _ \\ _| | / _ \\ | | \\ \\/ / _ \\ / _ \\ / _` |\n" +
    " / ___ \\ > _  |/ ___ |_  |/ ___ \\| |  >  <\\__  | (_) | | | |\n" +
    "/_/   \\_/_/ |_/_/   \\_\\|_/_/   \\_|_| /_/\\_|___/ \\___/|_| |_|\n" +
    "\n" +
    "Welcome! Type [[b;#aaa;]help] for a list of commands \n",
  enabled: $("body").attr("onload") === undefined,
});
// for codepen preview
if (!term.enabled()) {
  term.find(".cursor").addClass("blink");
}

function color(name, string) {
  var colors = {
    blue: "#55f",
    green: "#4d4",
    grey: "#999",
    red: "#A00",
    yellow: "#FF5",
    violet: "#a320ce",
    white: "#fff",
  };
  if (colors[name]) {
    return "[[;" + colors[name] + ";]" + string + "]";
  } else {
    return string;
  }
}
$("#type").on("change", function () {
  shell.removeClass("osx windows ubuntu default custom").addClass(this.value);
  term.set_prompt(prompt(this.value));
});
$("#dark").on("change", function () {
  shell.removeClass("dark light");
  if (this.checked) {
    shell.addClass("dark");
  } else {
    shell.addClass("light");
  }
});
$("#type, #dark").on("change", function () {
  setTimeout(function () {
    term.focus();
  }, 400);
});

function showHelp(consoleObj) {
  consoleObj.echo(color("red", "Available commands:"));
  consoleObj.echo(
    color(
      "blue",
      "Used a terminal before? There are a few easter eggs in here too :) \n"
    )
  );
  consoleObj.echo("PROTIP: press <tab> to trigger autocompletion");

  consoleObj.echo("\t[[b;#aaa;]ls,cat,???]    this is a terminal emulator");
  consoleObj.echo("\t[[b;#aaa;]ls]            to see the list of dir");
  consoleObj.echo("\t[[b;#aaa;]cd]            e.g. type: cd projects ");
  consoleObj.echo(
    "\t[[b;#aaa;]cat]           see what into that file e.g. cat 'Saved-Wifi-Passwords Grabber' "
  );
  consoleObj.echo("\t[[b;#aaa;]whoami]        just my simple bio");
  consoleObj.echo("\t[[b;#aaa;]contact]       get in touch");
  consoleObj.echo("\t[[b;#aaa;]resume]        list based bio");
  consoleObj.echo("\t[[b;#aaa;]clear]         if things get messy");
  consoleObj.echo("\t[[b;#aaa;]help]          if you get lost.");
  consoleObj.echo("\t[[b;#aaa;]credits]       where it's due");
  consoleObj.echo("");
}
