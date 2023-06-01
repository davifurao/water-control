import {
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  NumberInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import useDevice from '../../services/useDevice';
import { notifications } from '@mantine/notifications';
import img from '../../assets/casa.png';

interface CreateDeviceModalProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateDeviceModal = ({
  opened,
  onClose,
}: CreateDeviceModalProps) => {
  const { createDevice } = useDevice();

  const form = useForm({
    initialValues: {
      name: '',
      mac: '',
      maxCapacity: 0,
    },
    validate: {},
  });

  const formatMacAddress = (input: string) => {
    const cleanedInput = input.replace(/[^A-Fa-f0-9]/g, '');
    let formattedMac = '';

    for (let i = 0; i < cleanedInput.length; i++) {
      if (i > 0 && i % 2 === 0 && formattedMac.length < 16) {
        formattedMac += ':';
      }
      formattedMac += cleanedInput[i];
    }

    return formattedMac;
  };

  const handleChangeMacAddress = (event: any) => {
    const input = event.target.value;
    const formattedMac = formatMacAddress(input);
    form.setFieldValue('mac', formattedMac);
  };

  const handleSubmit = (data: {
    name: string;
    mac: string;
    maxCapacity: number;
  }) => {
    createDevice({
      name: data.name,
      mac: data.mac,
      maxCapacity: data.maxCapacity,
    })
      .then(() => {
        notifications.show({
          color: 'green',
          title: 'Success',
          message: 'New device registered',
        });
        onClose();
      })
      .catch((error: any) => {
        console.log({ error });
        notifications.show({
          color: 'red',
          title: 'Error',
          message: error.message,
        });
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <Image maw={30} mx="auto" radius="md" src={img} alt="Random image" />
          <Title order={3} color="#1A2F48">
            New Device
          </Title>
        </Group>
      }
      centered
      padding="xl"
      size="md"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit({ ...values }))}>
        <Grid grow gutter="xl" mt=".5rem">
          <Grid.Col span={6}>
            <TextInput
              label="Name"
              placeholder="device name"
              required
              {...form.getInputProps('name')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              maxLength={17}
              value={form.values.mac}
              onChange={handleChangeMacAddress}
              label="Mac Address"
              placeholder="00:00:00:00:00:00
              "
              required
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Reservatory Address"
              placeholder="street and number - city - state"
              // hideControls
              min={0}
              // precision={0}
              required
              // {...form.getInputProps('maxCapacity')}
            />
          </Grid.Col>
        </Grid>

        <Divider mt={'md'} mb="md" size="md" />

        <Grid grow gutter="xl" mb="1rem">
          <Grid.Col span={6}>
            <NumberInput
              label="Height (M)"
              hideControls
              min={0}
              precision={2}
              required
              {...form.getInputProps('maxCapacity')}
            />
            <NumberInput
              label="Base Radius (M)"
              hideControls
              min={0}
              precision={2}
              required
              {...form.getInputProps('maxCapacity')}
            />
            <NumberInput
              label="Max Capacity (L)"
              hideControls
              min={0}
              precision={2}
              required
              {...form.getInputProps('maxCapacity')}
            />
          </Grid.Col>
        </Grid>

        <Group position="apart">
          <Button
            compact
            onClick={() => onClose()}
            color="red"
            size="md"
            variant="outline"
            pl="xl"
            pr="xl"
          >
            Cancel
          </Button>
          <Button
            compact
            sx={{ ':hover': { backgroundColor: '#1A2F48' } }}
            type="submit"
            bg="#1A2F48"
            size="md"
            pl="xl"
            pr="xl"
            loading={false}
          >
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
