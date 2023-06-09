var permute = function (nums) {
  var result = [];
  if (nums.length == 1) {
    return x;
  }
  var size = nums.length;
  for (let i = 0; i < size; i++) {
    var removed = nums.splice(0, 1);

    perms = permute(nums);

    for (let j = 0; j < perms.length; j++) {
      perms[j].push(removed[0]);
      result.push(perms[j]);
    }

    nums.push(removed[0]);
  }
  return result;
};

n = [1, 2, 3];
permute(n, 1);
