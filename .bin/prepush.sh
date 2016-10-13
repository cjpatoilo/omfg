#!/bin/bash
# set -e # Exit with nonzero exit code if anything fails

# Statement
DIRECTORY="dist"
BRANCH="gh-pages"

# Arguments
if [ -n "${1}" ]
then
	DIRECTORY=$1
fi
if [ -n "${2}" ]
then
	BRANCH=$2
fi

# Verification
if [ "$#" -gt 2 ]
then
	cat bin/help
	exit 0
fi

# Options
if [ "$#" -gt 0 ]
then
	for ARGS in "$@"
	do
		if [ "${ARGS}" = "-h" ] || [ "${ARGS}" = "--help" ]
		then
			cat bin/help
			exit 0
		fi
	done
	for ARGS in "$@"
	do
		if [ "${ARGS}" = "-v" ] || [ "${ARGS}" = "--version" ]
		then
			echo "$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')"
			exit 0
		fi
	done
	for ARGS in "$@"
	do
		if [ "${ARGS}#-" ]
		then
			echo -e "\033[0;31mboeing: bad option: ${ARGS}"
			exit 0
		fi
	done
fi

# Prepare
git clone -b "${BRANCH}" --single-branch "$(git config remote.origin.url)" node_modules/boeing/"${BRANCH}"
cd node_modules/boeing/"${BRANCH}" || exit 1
rm -rf ./*
cp -rf ../../../"${DIRECTORY}"/* ./

# Diff
if [ -z "$(git diff --exit-code)" ]
then
	cd ..
	rm -rf "${BRANCH}"
	echo "No changes, exiting."
	exit 0
fi

# Push
git add .
git commit -m "Deploy to GitHub Pages: $(git rev-parse --verify HEAD)"
git push origin "${BRANCH}"

# Clean
cd ..
rm -rf "${BRANCH}"
echo "Deployed successfully, congrats!"
exit 0
