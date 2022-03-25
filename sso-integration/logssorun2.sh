#!/bin/bash

result=`curl 'http://localhost:9001/api/v1/login' \
  -H 'Connection: keep-alive' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Accept: */*' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: http://localhost:9001/login' \
  -H 'Accept-Language: en-CA,en;q=0.9' \
  --compressed`
echo $result | jq '.redirect' > redirect.txt




redirect=`cat redirect.txt | tr -d '"'` 




curl -i "$redirect" \
  -H 'Connection: keep-alive' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Referer: http://localhost:9001/' \
  -H 'Accept-Language: en-CA,en;q=0.9' \
  --compressed > form-cookies.txt





cat form-cookies.txt | grep Set-Cookie > first-cookies.txt
cat first-cookies.txt | grep 'AUTH_SESSION_ID=' > AUTH_SESSION_ID.txt
cat AUTH_SESSION_ID.txt | awk '{print $2}' > AUTH_SESSION_ID_2.txt
sed 's/AUTH_SESSION_ID=//' AUTH_SESSION_ID_2.txt > AUTH_SESSION_ID_3.txt
sed 's/;//' AUTH_SESSION_ID_3.txt > AUTH_SESSION_ID_4.txt
AUTH_SESSION_ID=`cat AUTH_SESSION_ID_4.txt`
AUTH_SESSION_ID_LEGACY=$AUTH_SESSION_ID






cat first-cookies.txt | grep 'KC_RESTART=' > KC_RESTART.txt
cat KC_RESTART.txt | awk '{print $2}' > KC_RESTART_2.txt
sed 's/KC_RESTART=//' KC_RESTART_2.txt > KC_RESTART_3.txt
sed 's/;//' KC_RESTART_3.txt > KC_RESTART_4.txt
KC_RESTART=`cat KC_RESTART_4.txt`









cat form-cookies.txt | grep form | grep "kc-form-login" > form-in-file-saved.txt
cat form-in-file-saved.txt | awk '{print $8}' > form-action-only.txt
sed 's/action="//' form-action-only.txt > form-action-only-2.txt
sed 's/"//' form-action-only-2.txt > form-action-only-3.txt
sed 's/amp;//' form-action-only-3.txt > form-action-only-4.txt
sed 's/amp;//' form-action-only-4.txt > form-action-only-5.txt
sed 's/amp;//' form-action-only-5.txt > form-action-only-6.txt
action=`cat form-action-only-6.txt`






cookies=`echo "Cookie: AUTH_SESSION_ID=${AUTH_SESSION_ID}; AUTH_SESSION_ID_LEGACY=${AUTH_SESSION_ID_LEGACY}; KC_RESTART=${KC_RESTART}" | tr -d '"'`
curl -i "$action" \
  -X POST \
  -H 'Connection: keep-alive' \
  -H 'Cache-Control: max-age=0' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'Origin: null' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Accept-Language: en-CA,en;q=0.9' \
  -H "$cookies" \
  --data-raw 'username=minio&password=minio123&credentialId=' \
  --compressed > referer-code-state.txt










cat referer-code-state.txt | grep Location > location.txt
cat location.txt | awk '{print $2}' > location-2.txt
location=`cat location-2.txt`








IFS='&'
read -ra ADDR <<< "$location"

echo ${ADDR[0]} > state.txt
echo ${ADDR[2]} > code.txt
sed 's/code=//' code.txt > code-1.txt
code=`cat code-1.txt`
echo $code
echo $code > /tmp/code





IFS='?'
state=`cat state.txt`
read -ra ADDR22 <<< "$state"
echo ${ADDR22[1]} > state-22.txt
sed 's/%3D/=/' state-22.txt > state-22-1.txt
sed 's/%3D/=/' state-22-1.txt > state-22-2.txt
sed 's/state=//' state-22-2.txt > state-22-3.txt
state=`cat state-22-3.txt`
echo $state
echo $state > /tmp/state













