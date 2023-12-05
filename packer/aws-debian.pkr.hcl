
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
  default = "subnet-07aff86fa6f35203a"
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

  sources = ["source.amazon-ebs.debian-ami"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "~/webapp.zip"
  }

  provisioner "shell" {

    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y nodejs npm",
      "sudo apt-get install -y unzip",
      "sudo unzip webapp.zip",
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
      "sudo cp /home/admin/app.service /lib/systemd/system/app.service",
      "echo 'Installing CloudWatch Agent'",
      "wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",
      "echo 'CloudWatch Agent Installed'",

      "sudo cp /home/admin/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",


      "sudo systemctl enable amazon-cloudwatch-agent",
      # Start CloudWatch agent
      "sudo systemctl start amazon-cloudwatch-agent",
    ]
  }
  post-processor "manifest" {
    output     = "packer/manifest.json"
    strip_path = true
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
