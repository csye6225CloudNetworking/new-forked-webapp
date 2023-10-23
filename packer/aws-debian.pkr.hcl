
packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "AWS_REGION" {
  type    = string
  default = "us-east-1"
}
variable "SOURCE_AMI_OWNER" {
  type    = string
  default = "454063085085"
}
variable "SOURCE_AMI_NAME" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}
variable "INSTANCE_TYPE" {
  type    = string
  default = "t2.micro"
}
variable "SSH_USERNAME" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0028adf715da30eb8"
}

source "amazon-ebs" "debian-ami" {

  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  source_ami      = "${var.SOURCE_AMI_NAME}"
  instance_type   = "${var.INSTANCE_TYPE}"
  region          = "${var.AWS_REGION}"
  ami_description = "AMI FOR CSYE"
  ssh_username    = "${var.SSH_USERNAME}"
  subnet_id       = "${var.subnet_id}"
  ami_users       = ["543718191891", "454063085085"]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
  /*   source_ami_filter {
    filters = {
      name                = "debian/images/*debian-12-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = [var.SOURCE_AMI_OWNER]
  } */

}

build {

  sources = ["source.amazon-ebs.debian-ami"

  provisioner "file" {
    source      = "webapp.zip"
    destination = "~/webapp.zip"
  }

  provisioner "shell" {
    /* enviornment_vars = [
      ""
    ] */
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nodejs npm",
      "sudo DEBIAN_FRONTEND=noninteractive apt update -q",
      "sudo DEBIAN_FRONTEND=noninteractive apt -q --assume-yes install mariadb-client mariadb-server",
      "sudo systemctl start mariadb",
      "sudo systemctl enable mariadb",
      "sudo mysql",
      "sudo DEBIAN_FRONTEND=noninteractive apt install -y unzip",
      "pwd",
      "ls -a",
      "cd /home/admin",
      "unzip webapp.zip",

    ]
  }


  /* 
  name    = "custom-debian-12-ami"
  sources = ["source.amazon-ebs.debian"] */

  /*  provisioner "shell" {
   script = "./app.sh" 
} */
  /* provisioner "file" {
   # Download the application artifact from GitHub Actions artifact
  /*  // "wget -O app-artifact.zip https://github.com/your-repo/actions/artifacts/app-artifact/app-artifact.zip",
  //source      = "app-artifact.zip"
  //destination = "/var/www/your-node-app/app-artifact.zip"
  // "unzip app-artifact.zip -d /var/www/your-node-app", 

   source = "C:\\NORTHEASTERN_MASTERS\\FALL'23\\CLOUD\\ASSIGNMENT\\ASSIGNMENT_4\\Rutuja_Patil_002728420_04.zip"
   destination = "/var/www/webapp"
} */
}
/*  inline = [
    "apt-get update -y",
  "apt-get install -y nodejs npm unzip",  # Install Node.js, npm, and unzip
    "npm install -g pm2",  # Install PM2 for process management
     "apt-get install -y mysql-server mariadb-server postgresql",  # Install MySQL/MariaDB/PostgreSQL
    "systemctl enable mysql mariadb postgresql",  # Enable the database services
    "systemctl start mysql mariadb postgresql" */

#to share it with DEMO ACCOUNT
/* post-processors {
  ami-copier {
    ami_name      = var.AMI_NAME
    destination_regions = ["us-west-2", "us-east-1"]  # Add more regions as needed
    target_account_ids = [var.DEMO_ACCOUNT_ID]  # Replace with your DEMO AWS Account ID
    encrypt        = true  # Encrypt the copied AMI
    snapshot_permissions = "private"  # Set the snapshot permissions to private
  }
} */
