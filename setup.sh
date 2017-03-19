#!/bin/bash

echo "*******************************" 
echo "Provisioning virtual machine..."
echo "*******************************" 

echo "***********************"
echo "Updating apt sources..."
echo "***********************"
sudo apt-get -qq update

echo "***********************************"
echo "Install and re-link node and npm..."
echo "***********************************"
sudo apt-get -y -qq install build-essential nodejs npm
#sudo ln -s "$(which nodejs)" /usr/bin/node


echo "***********************************"
echo "Run npm install
echo "***********************************"
npm config set strict-ssl false
cd /vagrant
sudo npm install
