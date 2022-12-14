sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "I'm fat"]
types = ["Hoodie", "Shirt"]
gender = ["Male", "Female", "Unisex", "Apache helicopter"]

import random

print(f'\"type\":\"{random.choice(types)}\"')
print(f'\"gender\":\"{random.choice(gender)}\"')


temp_sizes = []
for i in range(len(sizes)):
    temp_sizes.append(random.choice(sizes))


print(f"\"price\":{random.randint(2000, 20000)}")
print(f"\"stock\":{random.randint(10, 80)}")
print(f"\"size\":{str(list(set(temp_sizes)))}")