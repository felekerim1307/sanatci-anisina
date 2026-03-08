#!/bin/bash
V_FILE="/usr/local/lsws/conf/vhosts/cihanunat.com/vhost.conf"
# Cleanup
sed -i '/extprocess/,/}/d' $V_FILE
sed -i '/context \//,/}/d' $V_FILE

# Write clean vhost.conf
cat << 'EOF' > $V_FILE
docRoot $VH_ROOT/public_html
vhDomain $VH_NAME
vhAliases www.$VH_NAME
adminEmails admin@cihanunat.com
enableGzip 1

extprocess cihanproxy {
  type                    proxy
  address                 127.0.0.1:3001
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 cihanproxy
  addDefaultCharset       off
  allowBrowse             1
}

rewrite  {
  enable                  1
  autoLoadHtaccess        1
}
EOF

# LiteSpeed Restart
systemctl restart lsws

# .htaccess and permissions
echo "RewriteEngine On" > /home/cihanunat.com/public_html/.htaccess
SITE_USER=$(ls -ld /home/cihanunat.com | awk '{print $3}')
chown -R $SITE_USER:$SITE_USER /home/cihanunat.com/public_html/.htaccess
chmod 644 /home/cihanunat.com/public_html/.htaccess

# App Restart
pm2 restart cihan-anisina
echo "SUCCESS"
