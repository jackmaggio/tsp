x = 3;

var permute = function (nums) {
  var result = [];
  if (nums.length === 1) {
    return [[nums[0]]];
  }
  var size = nums.length;
  for (let i = 0; i < size; i++) {
    var removed = nums.splice(0, 1);

    var perms = permute(nums);

    for (let j = 0; j < perms.length; j++) {
      perms[j].push(removed[0]);
      result.push(perms[j]);
      if (perms[j].length == x) {
        console.log(perms[j].length, perms[j]);
      }
    }

    nums.push(removed[0]);
  }
  return result;
};

n = [1, 2, 3];
//permute(n);

var source = "A";
var dest = "B";

var edgeId = "";
if (source < dest) {
  edgeId = source + dest;
} else {
  edgeId = dest + source;
}
console.log(edgeId);
