var twoSum = function(nums, target) {
    const seen = new Map();
    for (let i =0; i < nums.length; i++){
        let need = target - nums[i];
        if(seen.has(need)){
            return [seen.get(need), i];
        }
        seen.set(nums[i],i);
    }
    return -1;
};