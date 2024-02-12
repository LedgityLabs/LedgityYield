1. Ensure you have Python 3.8+ installed ([get the latest version here](https://www.python.org/downloads/))
2. If you're using Python 3.12, manually install `setuptools` which is not bundled by default anymore: `pip3 install setuptools`
3. You're ready to get a Slither report with `bun cc:slither:report`
4. You can then perform a triage of the findings with `bun cc:slither:triage`