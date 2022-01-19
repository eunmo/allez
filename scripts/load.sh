add () {
  curl -X POST localhost:3040/api/crud/person \
    -H 'Content-Type: application/json' \
    -d "{\"firstName\": \"$1\", \"lastName\": \"$2\", \"type\": \"$3\"}"
}

add "주영" "김" "c"
add "기훈" "김" "c"
add "다은" "김" "f"
add "희수" "김" "f"
add "병운" "김" "m"
add "상훈" "이" "m"
add "은모" "양" "m"
add "현덕" "왕" "m"
add "현오" "이" "m"
