# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define :dotNet do |dotNet|
    dotNet.vm.box = "ubuntu/trusty64" 
#    dotNet.vm.provision :shell, path: "bootstrap.sh"
    dotNet.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
      vb.name = "dotNet"
    dotNet.vm.synced_folder "/Users/michael/Code/Eko", "/Eko", id: "Eko",
      owner: "vagrant",
      group: "www-data",
    mount_options: ["dmode=775,fmode=664"]
    dotNet.vm.network :forwarded_port, guest: 5000, host: 5000
    #dotNet.vm.network :forwarded_port, guest: 3306, host: 33060
  end
end
end
