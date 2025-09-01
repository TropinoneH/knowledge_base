---
type: software
tags:
  - software/vicon
  - software/ros
  - EmbodiedAI
  - ComputerVision
  - code
done: true
---
# Vicon

vicon是一套捕捉系统, 有12个摄像头. 其使用的marker是一个反光小球, 反射不可见光. 摄像头通过发射不可见光, 并捕捉小球的反光, 以此确定marker的位置

精度较高, 实际使用最多有 0.001m (1mm) 左右的误差

## 创建subject

1. 左侧subjects栏中右键创建一个新的subject, 改名字
2. 右键新的subject中的segment, 选择创建新的segment
3. 选中任意一个点作为起始点, 左键点击其他的点, 组成一个segment

这个segment会被视作刚体, 因此后续处理可能无法通过vicon处理.

vicon会自动计算segment组成的刚体的中心, 可以直接调用

# Connect With ROS

使用 [vicon_bridge2](https://github.com/Rooholla-KhorramBakht/vicon_bridge2) 将vicon的信息转发到[[ROS]]的[[ROS Topic|topic]].

## Connection

针对ros2

创建一个workspace, 然后在其中使用`colcon build`编译

编译好之后激活workspace的环境:
```bash
source install/setup.bash # for ros2
# source devel/setup.bash # for ros1
```

设置ip环境.
1. 将vicon的摄像头与交换机(可以使用路由器)相连
2. 将一台windows vicon上位机与交换机相连
3. 将ubuntu ros上位机与交换机相连
4. 设置ubuntu的ipv4配置(有线网络): manual
	- address: `192.168.10.111`
	- mask: `255.255.255.0`
5. 设置VICON_IP(默认地址):
	```bash
	export VICON_IP=192.168.10.1
	```
6. 启动`vicon_bridge2`:
	```bash
	ros2 launch vicon_bridge2 vicon.launch.py
	```
	当展示"Connect Successfully"的时候, 连接成功.
## Topic
### "/vicon/markers"

这个topic会发送被观测到的所有的markers的Pose信息(position, orientation)

position是以 mm 作为单位的, 坐标系是vicon的global position

Marker的格式为:
```c++
struct Marker {
	string marker_name;
	string subject_name;
	string segment_name;
	geometry_msgs::Point translation;
	bool occluded;
};
```

默认在一个subject中的`marker_name`是`<subject_name><n>`, `<n>`指的是第几个marker(在这个subject中)

如果一个marker不在任何的subject中, 那么其`marker_name = ""`, `subject_name = ""`, `segment_name = ""`

可以通过读取`marker_name`来判断这个marker是属于哪一个subject的

### "/vicon/<subject_name>/<segment_name>"

这个topic只会发送对应segment的质心的位置, 类型是 `geometry_msgs::msg::PoseStamped`

这个只会发送header和Pose这两个内容, 其中Pose是质心位置, 只有一个点.

如果想要获取segment的所有的marker的position, 使用`/vicon/markers`然后判断`marker_name`来获取