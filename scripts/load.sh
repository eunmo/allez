addPerson () {
  curl -X POST localhost:3040/api/crud/person \
    -H 'Content-Type: application/json' \
    -d "{\"firstName\": \"$1\", \"lastName\": \"$2\", \"type\": \"$3\"}"
}

addPerson "주영" "김" "c"
addPerson "기훈" "김" "c"
addPerson "다은" "김" "f"
addPerson "희수" "김" "f"
addPerson "병운" "김" "m"
addPerson "상훈" "이" "m"
addPerson "은모" "양" "m"
addPerson "현덕" "왕" "m"
addPerson "현오" "이" "m"

addGame () {
  l=$1
  r=$2
  curl -X POST localhost:3040/api/crud/game \
    -H 'Content-Type: application/json' \
    -d "{\"game\": { \"type\": 1, \"ls\": [$l], \"rs\": [$r], \"rounds\": [ { \"l\": $l, \"r\": $r, \"lp\": $3, \"rp\": $4 } ] } }"
}

addGame 1 2 5 2
sleep 1
addGame 3 4 3 5
sleep 1
addGame 5 6 5 4
sleep 1
addGame 7 8 2 5
