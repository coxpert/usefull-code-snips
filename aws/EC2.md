#[Createing AWS EC2 Instances for NGINX Open Source and NGINX Plus](https://docs.nginx.com/nginx/deployment-guides/amazon-web-services/ec2-instances-for-nginx/)

## Launch Instance 

1. visit EC2 Home 
https://us-east-2.console.aws.amazon.com/ec2/home
2. Select Region
3. Launch Instance
4. Give Name
5. Select Application (Amazon Linux as default)
6. Select Instance type (t2.micro as default)
7. Add storeage (as default)
8. Attach SSH key (If you don't have, please create new one.)
9. Allow SSH tracffic and HTTPs traffic.
10. Check Security Group
11. Click Launch Instance

12. Open MobaXterm
13. give IP4 address
14. give user name as "ec2-user", make sure the port number is 22.
15. import SSH key you just created or attatched.

## Install Nginx
16. 