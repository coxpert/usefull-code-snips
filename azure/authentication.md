# Install MgGraph Module

```
Install-Module Microsoft.Graph -Scope AllUsers
```

# Connect MgGraph

```
Connect-MgGraph -ClientId "134de60f-3feb-47f8-88aa-4e5768bab94b" -TenantId "4ba94d43-224e-4a49-9754-ea1fad30cdd6" -CertificateThumbprint "73F13FF4D13A225A99F9D564AF2D84B81DF582F8"
```

# Create Certificate

```
$FilePath = 'C:\Users\Administrator\Documents\certificates\'
$StoreLocation = 'CurrentUser'
$expirationYears = 1

$SubjectName = "blockskye.test"
$WildcardSubjectName = "*." + $SubjectName
$cert_password = 'blockskye@123'

$pfxFileName = $subjectName + '.pfx'
$cerFileName = $SubjectName + '.cer'

$PfxFilePath = $FilePath + $pfxFileName
$CerFilePath = $FilePath + $cerFileName

$CertBeginDate = Get-Date
$CertExpiryDate = $CertBeginDate.AddYears($expirationYears)

$SecStringPw = ConvertTo-SecureString -String $cert_password -Force -AsPlainText

$Cert = New-SelfSignedCertificate -DnsName $SubjectName, $WildcardSubjectName -FriendlyName $SubjectName -CertStoreLocation "cert:\$StoreLocation\My" -NotBefore $CertBeginDate -NotAfter $CertExpiryDate   -HashAlgorithm sha256 -KeyUsage CRLSign, CertSign, DataEncipherment, DigitalSignature, NonRepudiation, KeyEncipherment -TextExtension @("2.5.29.19={text}1.3.6.1.5.5.7.3.1,1.3.6.1.5.5.7.3.2")

Export-PfxCertificate -cert $Cert -FilePath $PfxFilePath -Password $SecStringPw

######################

$Cert = New-SelfSignedCertificate -DnsName $SubjectName, $WildcardSubjectName -FriendlyName $SubjectName -CertStoreLocation "cert:\$StoreLocation\My" -NotBefore $CertBeginDate -NotAfter $CertExpiryDate -KeySpec Signature -HashAlgorithm sha256 -KeyUsage CRLSign, CertSign, DataEncipherment, DigitalSignature, NonRepudiation, KeyEncipherment -TextExtension @("2.5.29.19={text}1.3.6.1.5.5.7.3.1,1.3.6.1.5.5.7.3.2")

Export-PfxCertificate -cert $Cert -FilePath $PfxFilePath -Password $SecStringPw
Export-Certificate -cert $Cert -FilePath $CerFilePath -Type CERT

```

# Get Private Key using open SSL

```
openssl pkcs12 -in blockskye.test.pfx -nocerts -out blockskye.test.pem -nodes
openssl pkcs12 -in blockskye.test.pfx -nokeys -out blockskye.test.crt
openssl rsa -in blockskye.test.pem -out blockskye.test.key
```

# Get in Virtual Certificates Driver.

```
ce cert:\
cd CurrentUser
ce My
```

# Export pfx key from valet ssl .crt

```
$SubjectName = "blockskye.test"
$pfxFileName = $subjectName + '.pfx'

$cert_password = 'blockskye@123'
$SecStringPw = ConvertTo-SecureString -String $cert_password -Force -AsPlainText

$PFXFilePath = 'C:\Users\Administrator\.config\valet\Certificates\' + $pfxFileName

$Cert = '.\B5F316B0B849024EB1418C9682081717FB0A862A'

Export-PfxCertificate -cert $Cert -FilePath $PFXFilePath -Password $SecStringPw
```

# Convert .CER to .CRT

```
openssl x509 -inform PEM -in <filepath>/certificate.cert -out certificate.crt
```

# Install OpenSSL

https://thesecmaster.com/procedure-to-install-openssl-on-the-windows-platform/#:~:text=Run%20OpenSSL,if%20OpenSSL%20is%20configured%20correctly.

# Create Self Signed Certificate

https://oak.dev/2021/02/03/create-a-self-signed-certificate-on-windows-for-local-development/

# NGINX SSL config

https://www.learnbestcoding.com/post/17/ssl-https-with-nginx

# Enable CBA

https://learn.microsoft.com/en-us/azure/active-directory/authentication/how-to-certificate-based-authentication
